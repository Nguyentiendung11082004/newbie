import { Response, Request } from "express";
import { handleError } from "../middlewares/error";
import Notification from "../model/notification";
import { StatusCodes } from "http-status-codes";
<<<<<<< HEAD

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
=======
import TeachingAssignment from "../model/teachingassignment";
import mongoose from "mongoose";
import Teacher from "../model/teacher";
interface CustomRequest extends Request {
    user: {
        _id: string;
        role: string;
        email: string;
        userId: string;
        class_id?: string;
        subjects?: string[];
    };
    // query: {
    //     teaching_assignment_id?: string | string[];
    //     from?: string;
    //     to?: string;
    // };
}
export const GetNotification = async (req: CustomRequest, res: Response) => {
    try {
        const { role, userId, class_id, subjects } = req.user;
        const { keyword, classFilter } = req.query;
        let query: any = {};
        if (role === "admin") {
            if (keyword) {
                query.title = { $regex: keyword.toString(), $options: "i" };
            }
            if (classFilter) {
                query.class_id = classFilter.toString();
            }
        } else if (role === "teacher") {
            query.sender_role = "teacher";
            query.sender_id = userId;
            if (keyword) {
                query.title = { $regex: keyword.toString(), $options: "i" };
            }
            if (classFilter) {
                query.class_id = classFilter.toString();
            }
        } else if (role === "student") {
            query.$or = [
                { target_type: "all" },
                { target_type: "student" },
                { target_type: "class", class_id: class_id },
                { target_type: "subject", subject_id: { $in: subjects || [] } },
            ];
        }
        const data = await Notification.find()
            // .sort({ createdAt: -1 })
            .populate("sender_id", "email");
        return res.status(StatusCodes.OK).json({
            message: "Thành công",
            data,
        });

    } catch (error) {
        handleError(res, error);
    }
};
>>>>>>> 6c1e0219d5928377aebd76055f2ed5f81d10f102
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
<<<<<<< HEAD
export const CreateNotification = async (req: Request, res: Response) => {
    try {
        const data = await Notification.create(req.body);
        res.status(StatusCodes.OK).json({
            message: "Thành công",
            data,
=======
export const CreateNotification = async (req: CustomRequest, res: Response) => {
    try {
        const { role, userId, _id } = req.user;
        let { title, content, target_type, class_id, student_ids } = req.body;
        if (!title || !content) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Thiếu tiêu đề hoặc nội dung "
            })
        }

        const roleUser = role?.toLowerCase();
        let target = target_type?.toLowerCase();
        let senderAuthId: any = userId;
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
            const teacher = await Teacher.findById(userId).select("authId");
            if (!teacher) {
                return res.status(404).json({ message: "Không tìm thấy" });
            }

            senderAuthId = teacher.authId;
            target_type = "class";
        }

        const noti = await Notification.create({
            title,
            content,
            target_type,
            class_id,
            student_ids,
            sender_id: senderAuthId,
            sender_role: role,
        });
        return res.status(StatusCodes.OK).json({
            message: "Thêm thông báo thành công",
            noti,
>>>>>>> 6c1e0219d5928377aebd76055f2ed5f81d10f102
        })
    } catch (error) {
        handleError(res, error)
    }
}
export const UpdateNotification = async (req: Request, res: Response) => {
    try {
<<<<<<< HEAD
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
=======
        const { _id, ...updateData } = req.body;

        if (!_id) {
            return res.status(400).json({ message: "Thiếu id thông báo" });
        }

        const data = await Notification.findByIdAndUpdate(
            _id,
            updateData,
            { new: true }
        );

        if (!data) {
            return res.status(404).json({ message: "Không tìm thấy thông báo" });
        }

        return res.json({
            message: "Cập nhật thông báo thành công",
            data
        });
>>>>>>> 6c1e0219d5928377aebd76055f2ed5f81d10f102
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