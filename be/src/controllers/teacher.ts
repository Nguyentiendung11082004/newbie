import { Request, Response } from "express";
import { handleError } from "../middlewares/error";
import Teacher from "../model/teacher";
import { StatusCodes } from "http-status-codes";
import TeachingAssignment from "../model/teachingassignment";
import { Types } from "mongoose";
import { CustomRequest, getDayOfWeekFromDate } from "../middlewares/utils";
import Enrollment from "../model/enrollment";

export const getAllTeacher = async (req: Request, res: Response) => {
    try {
        const {
            _page = '1',
            _limit = '10',
            _sort = 'createAt',
            _order = 'asc'
        } = req.query;
        const options = {
            page: parseInt(_page as string),
            limit: parseInt(_limit as string),
            sort: { [_sort as string]: _order === 'asc' ? 1 : -1 }
        }
        const teacher = await Teacher.paginate({}, options)
        res.status(StatusCodes.OK).json({
            data: {
                message: 'Thành công',
                data: teacher.docs,
                pagination: {
                    totalDocs: teacher.totalDocs,
                    totalPages: teacher.totalPages,
                    page: teacher.page,
                    limit: teacher.limit
                }
            }
        })
    } catch (error) {
        handleError(res, error)
    }
}
export const GetClassesByTeacher = async (req: CustomRequest, res: Response) => {
    try {
        // const { teacher_id } = req.body; // Nhận teacher_id từ params
        const authId = req.user.userId;
        if (!authId || !Types.ObjectId.isValid(authId)) {
            return res.status(400).json({ message: "authId không hợp lệ" });
        }

        const teacher = await Teacher.findOne({ authId });
        if (!teacher) {
            return res.status(404).json({ message: "Không tìm thấy giảng viên" });
        }
        const teacherId = teacher._id;
        // Truy vấn tất cả phân công giảng dạy của giảng viên theo teacher_id
        const assignments = await TeachingAssignment.find({ teacher_id: teacherId })
            .populate('class_id')     // Lấy tên lớp học từ class_id
            .populate('subject_id')   // Lấy thông tin môn học từ subject_id

        // Trả về dữ liệu lớp học giảng viên đang dạy
        res.status(200).json({
            message: 'Thành công',
            data: assignments
        });
    } catch (error) {
        handleError(res, error);
    }
};

export const GetTeacherTimeTable = async (req: CustomRequest, res: Response) => {
    try {
        const teacherId = req.user.userId;
        const { subjectId, classId, fromDate, toDate } = req.query;
        const query: any = {
            teacher_id: teacherId,
        };
        if (subjectId) query.subject_id = subjectId;
        if (classId) query.class_id = classId;
        if (fromDate && toDate) {
            const from = new Date(fromDate as string);
            const to = new Date(toDate as string);

            // Set giờ để lấy nguyên ngày
            from.setUTCHours(0, 0, 0, 0);
            to.setUTCHours(23, 59, 59, 999);

            query.startDate = { $gte: from, $lte: to };
        }
        // const assignments = await TeachingAssignment.find({
        //     teacher_id: teacherId,
        // }).populate([
        //     { path: 'subject_id', select: 'name' },
        //     { path: 'class_id', select: 'ClassName' }
        // ]);
        const assignments = await TeachingAssignment.find(query).populate([
            { path: "subject_id", select: "name" },
            { path: "class_id", select: "ClassName" },
        ]);
        const timetable = assignments.map((assign: any) => ({
            teachingAssignmentId: assign._id,
            subject: {
                id: assign.subject_id._id,
                name: assign.subject_id.name
            },
            class: {
                id: assign.class_id._id,
                name: assign.class_id.ClassName
            },
            weeklySchedule: assign.weeklySchedule.map((s: any) => ({
                dayOfWeek: s.dayOfWeek,
                startTime: s.startTime,
                endTime: s.endTime,
                room: s.room
            })),
            dateRange: {
                start: assign.startDate,
                end: assign.endDate
            },
            room: assign.room
        }));

        return res.status(StatusCodes.OK).json({
            message: "Thành công",
            data: timetable
        });

    } catch (error) {
        handleError(res, error);
    }
};
