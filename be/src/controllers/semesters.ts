import { Request, Response } from "express";
import { handleError } from "../middlewares/error";
import Semester from "../model/semester";
import { StatusCodes } from "http-status-codes";
export const GetAllSemesters = async (req: Request, res: Response) => {
    try {
        const data = await Semester.find();
        return res.status(StatusCodes.OK).json({
            message: 'Thành công',
            data: data
        })
    } catch (error) {
        handleError(res, error)
    }
}