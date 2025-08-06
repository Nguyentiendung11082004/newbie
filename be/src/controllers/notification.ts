import { Response, Request } from "express";
import { handleError } from "../middlewares/error";
import Notification from "../model/notification";
import { StatusCodes } from "http-status-codes";

export const GetAllNotification = async (req: Request, res: Response) => {
    try {
        const data = await Notification.find();
        res.status(StatusCodes.OK).json({
            message: 'Thành công',
            data,
        })
    } catch (error) {
        handleError(res, error)
    }
}
export const GetNotificationById = async (req: Request, res: Response) => {
    try {
        const data = await Notification.findById(req.params.id);
        if (!data) {
            res.status(StatusCodes.NOT_FOUND).json({
                message: "Not found"
            })
        }
        res.status(StatusCodes.OK).json({
            message: "Thành công",
            data,
        })
    } catch (error) {
        handleError(res, error)
    }
}
export const CreateNotification = async (req: Request, res: Response) => {
    try {
        const data = await Notification.create(req.body);
        res.status(StatusCodes.OK).json({
            message: "Thành công",
            data,
        })
    } catch (error) {
        handleError(res, error)
    }
}
export const UpdateNotification = async (req: Request, res: Response) => {
    try {
        const data = await Notification.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!data) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "Not found"
            })
        }
        return res.status(StatusCodes.OK).json({
            message: "Thành công",
            data,
        })
    } catch (error) {
        handleError(res, error)
    }
}
export const DeleteNotification = async (req: Request, res: Response) => {
    try {
        const data = await Notification.findByIdAndDelete(req.params.id)
        if (!data) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "Not found"
            })
        }
        return res.status(StatusCodes.OK).json({
            message: "Thành công",
        })
    } catch (error) {
        handleError(res, error)
    }
}