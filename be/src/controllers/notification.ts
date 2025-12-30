import { Response, Request } from "express";
import { handleError } from "../middlewares/error";
import Notification from "../model/notification";
import { StatusCodes } from "http-status-codes";
import TeachingAssignment from "../model/teachingassignment";
import mongoose from "mongoose";
interface CustomRequest extends Request {
    user: {
        _id: string;
        role: string;
        email: string;
        userId: string;
    };
    // query: {
    //     teaching_assignment_id?: string | string[];
    //     from?: string;
    //     to?: string;
    // };
}
export const GetNotification = async (req: CustomRequest, res: Response) => {
    try {
        const { role, userId } = req.user;
        let filter: any = {
            $or: [
                { receiver: "all" },
                { receiver: role }
            ]
        };

        // Nếu là sinh viên thì nhận thêm thông báo theo lớp
        // if (role === "student" && classId) {
        //     filter.$or.push({ receiver: classId });
        // }
        // Nếu trong tương lai gửi theo userId thì thêm cái này ( tuỳ schema của mày )
        filter.$or.push({ receiver: userId });
        const data = await Notification.find().sort({ created_at: -1 });
        return res.status(StatusCodes.OK).json({
            message: 'Thành công',
            data
        });

    } catch (error) {
        handleError(res, error);
    }
};
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
export const CreateNotification = async (req: CustomRequest, res: Response) => {
    try {
        const { role, userId } = req.user;
        const { title, content, target_type, class_id, student_ids } = req.body;
        if (!title || !content) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Thiếu tiêu đề hoặc nội dung "
            })
        }
        const roleUser = role?.toLowerCase();
        const target = target_type?.toLowerCase();
        if (roleUser === "teacher") {
            if (target === "all") {
                return res.status(403).json({
                    message: "Giảng viên không được gửi thông báo toàn hệ thống",
                });
            }
            if (!class_id) {
                return res.status(400).json({ message: "Thiếu class_id" });
            }
            const check = await TeachingAssignment.findOne({
                teacher_id: userId,
                class_id: class_id,
            });
            if (!check) {
                return res.status(403).json({
                    message: "Bạn không có quyền gửi thông báo đến lớp này",
                });
            }
        }
        const noti = await Notification.create({
            title,
            content,
            target_type,
            class_id,
            student_ids,
            sender_id: userId,
            sender_role: role,
        });
        return res.status(StatusCodes.OK).json({
            message: "Thành công",
            noti,
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