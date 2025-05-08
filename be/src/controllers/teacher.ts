import { Request, Response } from "express";
import { handleError } from "../middlewares/error";
import Teacher from "../model/teacher";
import { StatusCodes } from "http-status-codes";
import TeachingAssignment from "../model/teachingassignment";
import { Types } from "mongoose";

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
export const GetClassesByTeacher = async (req: Request, res: Response) => {
    try {
        const { teacher_id } = req.body; // Nhận teacher_id từ params
        if (!teacher_id || !Types.ObjectId.isValid(teacher_id)) {
            return res.status(400).json({ message: "teacher_id không hợp lệ" });
        }
        // Truy vấn tất cả phân công giảng dạy của giảng viên theo teacher_id
        const assignments = await TeachingAssignment.find({ teacher_id })
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

