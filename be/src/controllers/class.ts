import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes";
import Class from "../model/class";
import TeachingAssignment from "../model/teachingassignment";
import { handleError } from "../middlewares/error";
export const getAllClass = async (req: Request, res: Response) => {
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

        const classs = await Class.paginate({}, options);   

        res.status(StatusCodes.OK).json({
            message: 'Thành công',
            data: classs.docs,
            pagination: {
                totalDocs: classs.totalDocs,
                totalPages: classs.totalPages,
                page: classs.page,
                limit: classs.limit
            }
        });
    } catch (error) {
        handleError(res, error);
    }
};

export const getClassById = async (req: any, res: any) => {
    try {
        const data = await Class.findById(req.params.id).populate("MajorId");
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
export const createClass = async (req: Request, res: Response) => {
    try {
        const data = await Class.create(req.body);
        res.status(StatusCodes.OK).json({
            message: 'Thành công',
            data: data
        })
    } catch (error: unknown) {
        handleError(res, error)
    }
}
export const updateClass = async (req: Request, res: Response) => {
    try {
        const data = await Class.findByIdAndUpdate(req.params.id, req.body, {
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
export const deleteClass = async (req: Request, res: any) => {
    try {
        const data = await Class.findByIdAndDelete(req.params.id);
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