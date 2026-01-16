import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { handleError } from "../middlewares/error";
import Subject from "../model/subject";
export const getAllSubjects = async (req: Request, res: Response) => {
    try {
        const subjects = await Subject.find({});
        res.status(200).json({
            message: "Lấy danh sách môn học thành công",
            data: subjects,
        });
    } catch (error) {
        res.status(500).json({ error: "Lỗi server" });
    }
};

export const getAllSubject = async (req: Request, res: Response) => {
    try {
        const {
            _page = '1',
            _limit = '10',
            _sort = 'createdAt',
            _order = 'asc'
        } = req.query;

        const options = {
            page: parseInt(_page as string),
            limit: parseInt(_limit as string),
            sort: { [_sort as string]: _order === 'asc' ? 1 : -1 }
        };
        const subject = await Subject.paginate({}, options);
        res.status(StatusCodes.OK).json({
            status: "success",
            message: "Lấy danh sách môn học thành công",
            data: subject.docs,
            pagination: {
                totalDocs: subject.totalDocs,
                totalPages: subject.totalPages,
                page: subject.page,
                limit: subject.limit
            }
        });
    } catch (error) {
        handleError(res, error);
    }
};

export const getSubjectById = async (req: any, res: any) => {
    try {
        const data = await Subject.findById(req.params.id)
        if (!data) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Not found'
            })
        }
        return res.status(StatusCodes.OK).json({
            message: 'Thành công',
            data: data
        })
    } catch (error: unknown) {

    }
}
export const createSubject = async (req: Request, res: Response) => {
    try {
        const data = await Subject.create(req.body);
        res.status(StatusCodes.OK).json({
            data: data,
            message: 'Thành công',
            StatusCodes: StatusCodes.OK
        })
    } catch (error: unknown) {
        handleError(res, error)
    }
}
export const updateSubject = async (req: Request, res: Response) => {
    try {
        const data = await Subject.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        });
        if (!data) {
             res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Not found'
            })
        }
        res.status(StatusCodes.OK).json({
            message: 'Thành công',
            data: data
        })
    } catch (error) {
        handleError(res, error)
    }
}
export const deleteSubject = async (req: Request, res: any) => {
    try {
        const data = await Subject.findByIdAndDelete(req.params.id);
        if (!data) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Not found'
            })
        }
        res.status(StatusCodes.OK).json({
            message: 'Thành công',
        })
    } catch (error) {
        handleError(res, error)
    }
}