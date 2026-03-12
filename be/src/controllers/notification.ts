import { Response, Request } from "express";
import { handleError } from "../middlewares/error";
import Notification from "../model/notification";
import { StatusCodes } from "http-status-codes";
import TeachingAssignment from "../model/teachingassignment";
import mongoose from "mongoose";
import Teacher from "../model/teacher";
import Student from "../model/student";
interface CustomRequest extends Request {
    user: {
        _id: string;
        role: string;
        email: string;
        userId: string;
        class_id?: string;
        subjects?: string[];
        teacherId: string;
    };
    // query: {
    //     teaching_assignment_id?: string | string[];
    //     from?: string;
    //     to?: string;
    // };
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
export const GetNotification = async (req: CustomRequest, res: Response) => {
    try {
        const { role, userId, class_id, subjects } = req.user;
        let classId = null;
        let subjectIds: any[] = [];
        const { keyword, classFilter, mode = "view" } = req.query;

        let query: any = {};

        if (role === "admin") {
            if (mode === "manage") {
                query.sender_id = userId;
            }

            if (keyword) {
                query.title = { $regex: keyword.toString(), $options: "i" };
            }

            if (classFilter) {
                query.class_id = classFilter.toString();
            }
        }

        if (role === "teacher") {
            const classIds = Array.isArray(class_id) ? class_id : [class_id];
            const subjectIds = Array.isArray(subjects) ? subjects : [subjects];

            if (mode === "view") {
                query.$or = [
                    { target_type: "all" },
                    { target_type: "teacher" },
                    { target_type: "class", class_id: { $in: classIds } },
                    { target_type: "subject", subject_id: { $in: subjectIds } },
                    { sender_id: userId }
                ];
            }

            if (mode === "manage") {
                query.sender_id = userId;
            }
        }
        if (role === "student") {
            const student = await Student.findOne({ authId: userId }).select("classId subjects");
            classId = student?.classId;
            subjectIds = student?.subjects || [];
        }
        if (role === "student" && mode === "view") {
            query.$or = [
                { target_type: "all" },
                { target_type: "student" },
                { target_type: "class", class_id: { $in: classId } },
                { target_type: "subject", subject_id: { $in: subjectIds } }
            ];
        }
        const data = await Notification.find(query)
            .sort({ createdAt: -1 })
            .populate("sender_id", "email");

        return res.status(StatusCodes.OK).json({
            message: "Thành công",
            data,
        });
    } catch (error) {
        handleError(res, error);
    }
};
export const CreateNotification = async (req: CustomRequest, res: Response) => {
    try {
        const { role, userId, teacherId } = req.user;
        let { title, content, target_type, class_id, student_ids } = req.body;

        if (!title || !content) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Thiếu tiêu đề hoặc nội dung"
            });
        }

        const roleUser = role?.toLowerCase();
        let target = target_type?.toLowerCase();

        let senderAuthId = userId;

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
                teacher_id: teacherId,
                class_id: class_id,
            });

            if (!check) {
                return res.status(403).json({
                    message: "Bạn không có quyền gửi thông báo đến lớp này",
                });
            }

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
        });
    } catch (error) {
        handleError(res, error);
    }
};

export const UpdateNotification = async (req: Request, res: Response) => {
    try {
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