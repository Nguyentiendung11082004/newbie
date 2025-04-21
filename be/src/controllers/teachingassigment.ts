import { Request, Response } from "express"
import { handleError } from "../middlewares/error"
import { Types } from "mongoose";
import { StatusCodes } from "http-status-codes";
import Teacher from "../model/teacher";
import Class from "../model/class";
import Subject from "../model/subject";
import TeachingAssignment from "../model/teachingassignment";
export const CreateTechingassment = async (req: Request, res: Response) => {
    try {
        const { teacher_id, subject_id, class_id, semester, schedule } = req.body;
        const teacher = await Teacher.findById(teacher_id);
        if (!teacher) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Giảng viên không tồn tại"
            })
        }
        const subject = await Subject.findById(subject_id);
        if (!subject) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Môn học không tồn tại"
            })
        }
        const lop = await Class.findById(class_id);
        if (!lop) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Lớp không tồn tại'
            });
        }

        if (!schedule || schedule.lenght == 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: `Lịch học ${schedule} không hợp lệ hoặc đang trống`
            })
        }
        for (let slot of schedule) {
            if (
                !slot.dayOfWeek ||
                !slot.startTime ||
                !slot.endTime
            ) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: "Thiếu thông tin trong từng lịch học (dayOfWeek, startTime, endTime)"
                });
            }
        }
        const newAssing = await TeachingAssignment.create({
            teacher_id, subject_id, class_id, semester, schedule
        })
        return res.status(StatusCodes.OK).json({
            data: {
                message: 'Tạo phân công giảng dạy thành công',
                data: newAssing
            }
        })
    } catch (error) {
        handleError(res, error)
    }
}

export const GetTeachingassment = async (req: Request, res: Response) => {
    try {
        const techingassment = await TeachingAssignment.find()
        .populate('teacher_id', 'name')
        .populate('subject_id', 'name')
        .populate('class_id', 'ClassName')
        .exec();

        return res.status(StatusCodes.OK).json({
            data: {
                message:'Thành công',
                data: techingassment
            }
        })
    } catch (error) {
        handleError(res, error)
    }
}