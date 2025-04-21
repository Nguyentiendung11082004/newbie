import { Request, Response } from "express";
import { handleError } from "../middlewares/error";
import Teacher from "../model/teacher";
import { StatusCodes } from "http-status-codes";

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
