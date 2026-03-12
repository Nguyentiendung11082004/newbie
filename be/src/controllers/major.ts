import { Request, Response } from "express";
import { handleError } from "../middlewares/error";
import Major from "../model/major";
import { StatusCodes } from "http-status-codes";

export const getAllMajor = async (req: Request, res: Response) => {
    try {
        const { page = '1', limit = '10', sort = 'createdAt', order = 'asc' } = req.query;

        const options = {
            page: parseInt(page as string),
            limit: parseInt(limit as string),
            sort: { [sort as string]: order === 'asc' ? 1 : -1 },
        }

        const major = await Major.paginate({}, options);
        console.log("major", major)
        res.status(StatusCodes.OK).json({
            message: 'Thành công',
            data: major.docs,
            pagination: {
                totalDocs: major.totalDocs,
                totalPages: major.totalPages,
                page: major.page,
                limit: major.limit
            }
        })
    } catch (error) {
        handleError(res, error)
    }
}
export const getMajorById = async (req: Request, res: Response) => {
    try {
        const major = await Major.findById(req.params.id);
        if (!major) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: 'Not found'
            })
        }
        return res.status(StatusCodes.OK).json({
            message: 'Thành công',
            data: major
        })
    } catch (error) {
        handleError(res, error)
    }
}
export const createMajor = async (req: Request, res: Response) => {
    try {
        const major = await Major.create(req.body);
        res.status(StatusCodes.OK).json({
            message: 'Tạo thành công',
            data: major
        })
    } catch (error) {
        handleError(res, error)
    }
}
export const updateMajor = async (req: Request, res: Response) => {
    try {
        const major = await Major.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!major) {
            res.status(StatusCodes.NOT_FOUND).json({
                message: 'Not found',
            })
        }
        res.status(StatusCodes.OK).json({
            message: 'Thành công',
            data: major
        })
    } catch (error) {
        handleError(res, error)
    }
}
export const deleteMajor = async (req: Request, res: Response) => {
    try {
        const major = await Major.findByIdAndDelete(req.params.id);
        if (!major) {
            res.status(StatusCodes.NOT_FOUND).json({
                messsage: 'Not found'
            })
        }
        res.status(StatusCodes.OK).json({
            message: 'Thành công'
        })
    } catch (error) {
        handleError(res, error)
    }
}