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
        const enrollment = await Enrollment.create({
            student_id,
            teaching_assignment_id: teachingAssignment._id,
            status: 'Pending',
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