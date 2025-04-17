import { Request, Response } from "express"
import Student from "../model/student"
import { StatusCodes } from "http-status-codes";

export const getAllStudents = async (req: Request, res: Response) => {
    try {
        const {
            _page = 1,
            _limit = 10,
            _sort = "createdAt",
            _order = "asc",
            Keyword = ""
        } = req.body;
        const query: any = {};
        if (Keyword) {
            const regex = { $regex: Keyword, $options: 'i' };
            query.$or = [
                { name: regex },
                { email: regex },
                { className: regex },
                { major: regex }
            ];
        }
        const options = {
            page: parseInt(_page),
            limit: parseInt(_limit),
            sort: { [_sort]: _order === 'asc' ? 1 : -1 }
        };
        const students = await Student.paginate(query, options);
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
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({ message: 'Đã có lỗi xảy ra' });
        }
    }
}
