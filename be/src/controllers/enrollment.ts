import { handleError } from "../middlewares/error"
import { Request, Response } from "express"
import Student from "../model/student";
import TeachingAssignmentSchema from "../model/teachingassignment"
import Subject from "../model/subject"
import { StatusCodes } from "http-status-codes";
import Enrollment from "../model/enrollment";
import { Types } from "mongoose";
import TeachingAssignment from "../model/teachingassignment";
import { EnrollmentValidate } from "../schema/enrolment";
import Attendance from "../model/attdance";
export const getAllEnrollSubject = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const {
            _page = 1,
            _limit = 10,
            _sort = "createdAt",
            _order = "asc",
        } = req.body;
        const query: any = {};
        const options = {
            page: parseInt(_page),
            limit: parseInt(_limit),
            sort: { [_sort]: _order === 'asc' ? 1 : -1 }
        };
        const students = await Enrollment.paginate(query, options);
        res.status(StatusCodes.OK).json({
            message: 'Thành công',
            data: students.docs,
            pagination: {
                totalDocs: students.totalDocs,
                totalPages: students.totalPages,
                page: students.page,
                limit: students.limit
            }
        })

    } catch (error) {
        handleError(res, error);
    }
}
export const getTeachingAssignmentsForEnroll = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const { subject_id, teacher_id } = req.body;
        const query: any = {};
        if (subject_id) query.subject_id = subject_id;
        if (teacher_id) query.teacher_id = teacher_id;

        const assignments = await TeachingAssignment.find(query)
            .populate('subject_id')
            .populate('teacher_id')
            .populate('class_id');

        if (!assignments) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Không có lớp giảng dạy phù hợp',
                data: assignments,
            });
        }
        return res.status(StatusCodes.OK).json({
            message: 'Danh sách lớp giảng dạy phù hợp',
            data: assignments,
        });
    } catch (error) {
        handleError(res, error);
    }
}

export const getEnrollSubject = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const { student_id } = req.body;
        if (!Types.ObjectId.isValid(student_id)) {
            return res.status(400).json({ message: "student_id không hợp lệ" });
        }
        // const enrollments = await Enrollment.find({
        //     student_id: Types.ObjectId.createFromHexString(student_id),
        // }).populate('teaching_assignment_id', 'name subject_id semester').exec();
        const enrollments = await Enrollment.find({ student_id })
            .populate({
                path: 'teaching_assignment_id',
                populate: [
                    { path: 'subject_id', model: 'Subject' },       // Lấy thông tin môn học
                    { path: 'teacher_id', model: 'Teacher' },       // (tuỳ chọn) Lấy giảng viên
                    { path: 'class_id', model: 'Class' }            // (tuỳ chọn) Lấy lớp học
                ]
            });

        return res.status(StatusCodes.OK).json({
            message: 'Thành công',
            data: enrollments,
        })
    } catch (error) {
        handleError(res, error)
    }
}
export const CreateEnrollSubject = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const { student_id, subject_id, teacher_id } = req.body;
        const validate = EnrollmentValidate.validate(req.body, { abortEarly: false, allowUnknown: true });
        if (validate.error) {
            const errors = validate.error.details.map((e: any) => (
                {
                    field: e.path[0],
                    message: e.message
                }
            ));
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                errors
            });
        }
        const student = await Student.findById(student_id);
        if (!student) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Sinh viên không tồn tại'
            });
        }
        const teachingAssignment = await TeachingAssignmentSchema.findOne({
            subject_id,
            teacher_id
        });
        if (!teachingAssignment) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Không tìm thấy phân công giảng dạy tương ứng với môn học và giảng viên đã chọn.'
            });
        }
        const exitEnrollment = await Enrollment.findOne({ student_id, teaching_assignment_id: teachingAssignment._id });
        if (exitEnrollment) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Sinh viên đã ghi danh môn học này." });
        }
        const enrolledCount = await Enrollment.countDocuments({
            teaching_assignment_id: teachingAssignment._id,
            status: { $in: ['Approved', 'Pending'] },
        })
        console.log("enrolledCount", enrolledCount)
        console.log(" teachingAssignment.maxStudent ", teachingAssignment.maxStudent)
        if (enrolledCount >= teachingAssignment.maxStudent) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Lớp học đã đầy, không thể ghi danh thêm.'
            });
        }
        const enrollment = await Enrollment.create({
            student_id,
            teaching_assignment_id: teachingAssignment._id,
            status: 'Approved',
            enrolled_at: new Date()
        });

        return res.status(StatusCodes.OK).json({
            data: {
                message: 'Đăng ký môn học thành công.',
                data: enrollment
            }
        });
    } catch (error) {
        handleError(res, error);
    }
}
export const updateEnrollSubject = async (req: Request, res: Response) => {
    try {
        const enrollsubject = await Enrollment.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        })
        if (!enrollsubject) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "Không tìm thấy enrollsubject"
            })
        }
        return res.status(StatusCodes.OK).json({
            data: {
                message: "Thành công",
                data: enrollsubject
            }
        })
    } catch (error) {
        handleError(res, error)
    }
}
export const DeleteEnroll = async (req: Request, res: Response) => {
    try {
        const enroll = await Enrollment.findByIdAndDelete(req.params.id);
        if (!enroll) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Not Found"
            })
        }
        return res.status(StatusCodes.OK).json({
            data: {
                message: "Thành công"
            }
        })
    } catch (error) {
        handleError(res, error)
    }
}
export const GetEnrollmentByTeacher = async (req: Request, res: Response) => {
    try {
        const { teacher_id, status = 'Pending', page = 1, limit = 10 } = req.body;
        const assignments = await TeachingAssignment.find({ teacher_id });
        const assignmentIds = assignments.map(a => a._id);
        const skip = (page - 1) * limit;
        const [enrollments, total] = await Promise.all([
            Enrollment.find({
                teaching_assignment_id: { $in: assignmentIds },
                status
            })
                .skip(skip)
                .limit(limit)
                .populate([
                    { path: 'student_id', select: 'name email' },
                    {
                        path: 'teaching_assignment_id',
                        populate: [
                            { path: 'subject_id', select: 'name' },
                            { path: 'class_id', select: 'name' },
                        ]
                    }
                ]),
            Enrollment.countDocuments({
                teaching_assignment_id: { $in: assignmentIds },
                status
            })
        ]);
        return res.status(StatusCodes.OK).json({
            data: {
                message: 'Thành công',
                data: enrollments,
                pagination: {
                    total,
                    page: Number(page),
                    limit: Number(limit)
                }
            }
        });
    } catch (error) {
        handleError(res, error)
    }
}
export const GetEnrollmentsByTeachingAssignment = async (req: Request, res: Response) => {
    try {
        const { teaching_assignment_id, date } = req.body;

        if (!Types.ObjectId.isValid(teaching_assignment_id)) {
            return res.status(400).json({ message: 'teaching_assignment_id không hợp lệ' });
        }

        // Lấy danh sách ghi danh
        const enrollments = await Enrollment.find({ teaching_assignment_id })
            .populate('student_id', 'name email') // Lấy name + email nếu cần

        // Lấy danh sách điểm danh ứng với teaching_assignment_id + date
        const attendanceRecords = await Attendance.find();

        console.log("attendanceRecords", attendanceRecords)
        // Map điểm danh theo student_id cho tiện tra cứu
        const attendanceMap = new Map();
        attendanceRecords.forEach((record: any) => {
            record.attendances.forEach((att: any) => {
                attendanceMap.set(att.student_id.toString(), {
                    status: att.status,
                    note: att.note,
                });
            });
        });
        console.log("attendanceMap", attendanceMap)
        // Gộp trạng thái điểm danh vào từng sinh viên
        const result = enrollments.map((enrollment) => {
            const studentId = enrollment.student_id._id.toString();
            const attendance = attendanceMap.get(studentId);
            console.log("attendance", attendance)
            return {
                ...enrollment.toObject(),
                status: attendance?.status || 'absent',
                // attendance_note: attendance?.note || '',
            };
        });

        return res.status(200).json({
            message: 'Thành công',
            data: result
        });

    } catch (error) {
        handleError(res, error);
    }
}
