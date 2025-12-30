import { Request, Response } from "express";
import { handleError } from "../middlewares/error";
import TeachingAssignment from "../model/teachingassignment";
import Enrollment from "../model/enrollment";
import Attendance from "../model/attdance";
import { StatusCodes } from "http-status-codes";
import mongoose from 'mongoose';
interface CustomRequest extends Request {
    user: {
        _id: string;
        role: string;
        email: string;
        userId: string;
    };
    query: {
        teaching_assignment_id?: string | string[];
        from?: string;
        to?: string;
    };
}
export const CreateAttendance = async (req: Request, res: Response) => {
    try {
        const { teaching_assignment_id, date, attendances } = req.body;
        // Kiểm tra xem lớp học và buổi học có hợp lệ không
        const teachingAssignment = await TeachingAssignment.findById(teaching_assignment_id);
        if (!teachingAssignment) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Lớp học không tồn tại' });
        }
        // kiểm tra xem có đúng ngày đi học để điểm danh không
        const dateObj = new Date(date).toISOString().split('T')[0]; 
        console.log("dateObj",dateObj)
        const isInSchedule = teachingAssignment.schedule.some((schedule: any) => {
            console.log("schedule.date",schedule.date)
            return schedule.date === dateObj;
        });


        if (!isInSchedule) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Ngày này không nằm trong lịch học của lớp', status: StatusCodes.BAD_REQUEST });
        }


        // // Kiểm tra xem các sinh viên có phải đã ghi danh lớp học này không
        const enrolledStudents = await Enrollment.find({ teaching_assignment_id: teaching_assignment_id });
        const enrolledStudentIds = enrolledStudents.map((enroll) => enroll.student_id.toString());
        // Kiểm tra xem các student_id trong body có hợp lệ không
        const invalidAttendances = attendances.filter(
            (attendance: { student_id: string }) => !enrolledStudentIds.includes(attendance.student_id)
        );
        if (invalidAttendances.length > 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Một số sinh viên không có mặt trong lớp học này', status: StatusCodes.BAD_REQUEST });
        }

        // Kiểm tra xem điểm danh đã có cho ngày này chưa
        let existingAttendance = await Attendance.findOne({ teaching_assignment_id, date });

        // Nếu đã có, tiến hành cập nhật điểm danh
        if (existingAttendance) {
            existingAttendance.attendances = attendances;
            await existingAttendance.save();
            return res.status(StatusCodes.OK).json({
                message: 'Điểm danh đã được cập nhật',
                data: existingAttendance,
                status: StatusCodes.OK
            });
        }
        const data = await Attendance.create({
            teaching_assignment_id,
            date,
            attendances,
        })
        return res.status(StatusCodes.OK).json({
            data: {
                message: 'Điểm danh đã được tạo',
                data: data,
                status: StatusCodes.OK
            }
        });
    } catch (error) {
        handleError(res, error)
    }
}
export const getAttendanceHistory = async (req: CustomRequest, res: Response) => {
    try {
        const { role, userId } = req.user;
        const { teaching_assignment_id, from, to } = req.query;

        // Helper chuyển string | string[] sang ObjectId hoặc undefined
        function toObjectId(id: string | string[] | undefined) {
            if (!id) return undefined;
            if (Array.isArray(id)) id = id[0];
            try {
                return new mongoose.Types.ObjectId(id);
            } catch {
                return undefined;
            }
        }

        // Tạo match filter cho $match trong pipeline
        const match: any = {};
        const teachingAssignmentObjectId = toObjectId(teaching_assignment_id);
        if (teachingAssignmentObjectId) {
            match.teaching_assignment_id = teachingAssignmentObjectId;
        }
        if (from || to) {
            match.date = {};
            if (from) match.date.$gte = new Date(from);
            if (to) match.date.$lte = new Date(to);
        }

        // Tạo điều kiện lọc attendances theo role (student hoặc teacher)
        let filterCond = null;
        const pipeline: any[] = [];
        // Nếu là sinh viên thì lọc theo student_id của chính mình
        if (role === 'student') {
            filterCond = { $eq: ['$$attendance.student_id', new mongoose.Types.ObjectId(userId)] };

            // Chỉ push $addFields nếu là student
            pipeline.push({
                $addFields: {
                    attendances: {
                        $filter: {
                            input: '$attendances',
                            as: 'attendance',
                            cond: filterCond,
                        },
                    },
                },
            });
        }

        // Nếu là teacher => KHÔNG push $addFields => giữ nguyên attendances


        // Build pipeline aggregation

        // 1. Lọc theo điều kiện chung
        pipeline.push({ $match: match });

        // 2. Lọc attendances trong mảng theo filterCond (nếu có)
        pipeline.push({
            $addFields: {
                attendances: filterCond
                    ? {
                        $filter: {
                            input: '$attendances',
                            as: 'attendance',
                            cond: filterCond,
                        },
                    }
                    : '$attendances',
            },
        });

        // 3. Lookup lấy dữ liệu teaching_assignment
        pipeline.push({
            $lookup: {
                from: 'teachingassignments', // tên collection phải đúng
                localField: 'teaching_assignment_id',
                foreignField: '_id',
                as: 'teaching_assignment',
            },
        });
        pipeline.push({ $unwind: '$teaching_assignment' });

        // 4. Lookup để populate attendances.student_id (join student info)
        pipeline.push({ $unwind: { path: '$attendances', preserveNullAndEmptyArrays: true } });
        pipeline.push({
            $lookup: {
                from: 'students',
                localField: 'attendances.student_id',
                foreignField: '_id',
                as: 'attendances.student',
            },
        });
        pipeline.push({ $unwind: { path: '$attendances.student', preserveNullAndEmptyArrays: true } });

        // 5. Gom lại thành mảng attendances
        pipeline.push({
            $group: {
                _id: '$_id',
                teaching_assignment: { $first: '$teaching_assignment' },
                date: { $first: '$date' },
                attendances: { $push: '$attendances' },
                createdAt: { $first: '$createdAt' },
                updatedAt: { $first: '$updatedAt' },
            },
        });

        // 6. (Tùy chọn) Sắp xếp theo date giảm dần
        pipeline.push({ $sort: { date: -1 } });

        const data = await Attendance.aggregate(pipeline);

        return res.status(StatusCodes.OK).json({
            message: 'Thành công',
            data,
        });
    } catch (error) {
        console.error('getAttendanceHistory error:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Lỗi server' });
    }
};
// export const getAttendanceHistory = async (req: CustomRequest, res: Response) => {
//     try {
//         const { role } = req.user;
//         const { teaching_assignment_id, from, to } = req.query;

//         let match: any = {};
//         if (teaching_assignment_id) match.teaching_assignment_id = teaching_assignment_id;
//         if (from || to) {
//             match.date = {};
//             if (from) match.date.$gte = new Date(String(from));
//             if (to) match.date.$lte = new Date(String(to));
//         }
//         if (role === 'student') {
//             match['attendances.student_id'] = req.user.userId;
//         }
//         if (role === 'teacher') {
//             match['attendances.teacher_id'] = req.user.userId;
//         }
//         console.log("match", match)
//         const data = await Attendance.find(match)
//             .populate('teaching_assignment_id')
//             .populate('attendances.student_id');
//         return res.status(StatusCodes.OK).json({
//             data: {
//                 message: 'Thành công',
//                 data: data
//             }
//         })
//     } catch (error) {
//         handleError(res, error)
//     }
// }