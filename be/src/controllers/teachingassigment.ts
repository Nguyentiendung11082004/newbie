import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { handleError } from "../middlewares/error";
import Class from "../model/class";
import Subject from "../model/subject";
import Teacher from "../model/teacher";
import TeachingAssignment from "../model/teachingassignment";
import { request } from "http";
import Semester from "../model/semester";
const dayOfWeekToNumber = (day: string) => {
    const daysMap = {
        Sunday: 0,
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6,
    } as const;

    return daysMap[day as keyof typeof daysMap] ?? 0;
};

const generateSchedule = (
    startDate: string,
    numberOfClasses: number,
    weeklySchedule: { dayOfWeek: string; startTime: string; endTime: string }[]
) => {
    const schedule: any[] = [];
    let currentDate = new Date(startDate);

    let count = 0;

    while (count < numberOfClasses) {
        for (const slot of weeklySchedule) {
            const targetDay = dayOfWeekToNumber(slot.dayOfWeek);
            const tempDate = new Date(currentDate);

            // Move to the next matching day of week
            while (tempDate.getDay() !== targetDay) {
                tempDate.setDate(tempDate.getDate() + 1);
            }

            if (tempDate >= currentDate) {
                schedule.push({
                    date: tempDate.toISOString().split("T")[0],
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                });
                count++;
                if (count >= numberOfClasses) break;
            }
        }

        currentDate.setDate(currentDate.getDate() + 7); // sang tuần tiếp theo
    }

    return schedule.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const CreateTeachingAssignment = async (req: Request, res: Response) => {
    try {
        const { teacher_id, subject_id, class_id, semester_id, startDate, numberOfClasses, weeklySchedule } = req.body;

        if (!teacher_id || !subject_id || !class_id || !semester_id || !startDate || !numberOfClasses || !weeklySchedule) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Thiếu thông tin bắt buộc"
            });
        }

        if (!Array.isArray(weeklySchedule) || weeklySchedule.length === 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "weeklySchedule phải là mảng và không được trống"
            });
        }

        const teacher = await Teacher.findById(teacher_id);
        if (!teacher) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Giảng viên không tồn tại" });
        }

        const subject = await Subject.findById(subject_id);
        if (!subject) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Môn học không tồn tại" });
        }

        const lop = await Class.findById(class_id);
        if (!lop) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Lớp không tồn tại" });
        }
        
        const ky = await Semester.findById(semester_id);
        if (!ky) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Kỳ không tồn tại" });
        }

        const generatedSchedule = generateSchedule(startDate, numberOfClasses, weeklySchedule);

        const newAssignment = await TeachingAssignment.create({
            teacher_id,
            subject_id,
            class_id,
            semester_id,
            startDate,
            numberOfClasses,
            weeklySchedule,
            schedule: generatedSchedule
        });

        return res.status(StatusCodes.OK).json({
            message: "Tạo phân công giảng dạy thành công",
            data: newAssignment
        });
    } catch (error) {
        handleError(res, error);
    }
};


export const GetTeachingassment = async (req: Request, res: Response) => {
    try {
        const techingassment = await TeachingAssignment.find()
            .populate('teacher_id', 'name')
            .populate('subject_id', 'name')
            .populate('class_id', 'ClassName')
            .populate('semester_id', 'name')
            .exec();

        return res.status(StatusCodes.OK).json({
            data: {
                message: 'Thành công',
                data: techingassment
            }
        })
    } catch (error) {
        handleError(res, error)
    }
}

export const GetTeachigngassmentById = async (req: Request, res: Response) => {
    try {
        const { id } = req.query;
        const data = await TeachingAssignment.findById(id);
        //     .populate('teacher_id', 'name')
        //     .populate('subject_id', 'name')
        //     .populate('class_id', 'ClassName')
        //     .exec();
        // ;

        if (!data) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Not found'
            })
        }
        return res.status(StatusCodes.OK).json({
            data: {
                message: 'Thành công',
                data: data
            }
        })
    } catch (error) {
        handleError(res, error)
    }
}
export const UpdateTeachingAssignment = async (req: Request, res: Response) => {
    try {
        const { id } = req.query
        const data = await TeachingAssignment.findByIdAndUpdate(id, req.body, {
            new: true
        })
        if (!data) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Not found'
            })
        }
        return res.status(StatusCodes.OK).json({
            data: {
                message: 'Cập nhật thành công',
                data: data
            }
        })
    } catch (error) {
        handleError(res, error)
    }
}
export const DeleteTeachingAssignment = async (req: Request, res: Response) => {
    try {
        const data = await TeachingAssignment.findByIdAndDelete(req.params.id)
        if (!data) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Not found'
            })
        }
        return res.status(StatusCodes.OK).json({
            message: 'Xoá hành công',
        })
    } catch (error) {
        handleError(res, error)
    }
}