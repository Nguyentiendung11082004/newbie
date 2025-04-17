import { handleError } from "../middlewares/error"
import { Request, Response } from "express"
import Student from "../model/student";
import Subject from "../model/subject"
import { StatusCodes } from "http-status-codes";
import Enrollment from "../model/enrollment";
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
export const getEnrollSubject = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const { student_id } = req.body;
        const enrollments = await Enrollment.find({ student_id }).populate('subject_id', 'name credits semester').exec();
        return res.status(StatusCodes.OK).json({
            message: {
                data: enrollments,
            }
        })
    } catch (error) {
        handleError(res, error)
    }
}
export const EnrollSubject = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const { student_id, subject_id } = req.body;
        const student = await Student.findById(student_id);
        if (!student) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Sinh viên không tồn tại'
            });
        }
        const subject = await Subject.findById(subject_id);
        if (!subject) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Môn học không tồn tại'
            });
        }
        const exitEnrollment = await Enrollment.findOne({ student_id, subject_id });
        if (exitEnrollment) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Sinh viên đã ghi danh môn học này." });
        }
        const enrollment = await Enrollment.create({
            student_id,
            subject_id,
            status: 'Pending',
            enrolled_at: new Date()
        });
        return res.status(StatusCodes.OK).json({
            data: {
                message: 'Thành công',
                data: enrollment
            }
        });
    } catch (error) {
        handleError(res, error);
    }
}
