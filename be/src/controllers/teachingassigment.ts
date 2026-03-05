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
    const daysMap: Record<string, number> = {
        'Chủ nhật': 0,
        'Thứ 2': 1,
        'Thứ 3': 2,
        'Thứ 4': 3,
        'Thứ 5': 4,
        'Thứ 6': 5,
        'Thứ 7': 6
    };

    return daysMap[day.trim()] ?? 0;
};
const parseLocalDate = (dateStr: string): Date => {
    if (!dateStr || typeof dateStr !== "string") {
        throw new Error("Invalid startDate: " + dateStr);
    }

    const [year, month, day] = dateStr.split('-').map(Number);
    if (!year || !month || !day) {
        throw new Error("startDate format must be YYYY-MM-DD. Got: " + dateStr);
    }

    return new Date(year, month - 1, day);
};
const generateSchedule = (
    startDate: string,
    numberOfClasses: number,
    weeklySchedule: { dayOfWeek: string; startTime: string; endTime: string }[]
) => {
    const schedule: any[] = [];
    let currentDate = parseLocalDate(startDate.split("T")[0]); // ✅ dùng local date
    let count = 0;

    while (count < numberOfClasses) {
        for (const slot of weeklySchedule) {
            const targetDay = dayOfWeekToNumber(slot.dayOfWeek);
            const tempDate = new Date(currentDate);

            // Move tempDate đến đúng thứ cần tìm trong tuần
            while (tempDate.getDay() !== targetDay) {
                tempDate.setDate(tempDate.getDate() + 1);
            }

            if (tempDate >= currentDate) {
                schedule.push({
                    date: tempDate.toLocaleDateString('en-CA'), // ✅ YYYY-MM-DD theo local time
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                });
                count++;
                if (count >= numberOfClasses) break;
            }
        }

        // Sang tuần tiếp theo
        currentDate.setDate(currentDate.getDate() + 7);
    }

    // Sắp xếp theo ngày tăng dần
    return schedule.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};
export const CreateTeachingAssignment = async (req: Request, res: Response) => {
    try {
        const { teacher_id, subject_id, class_id, semester_id, startDate, numberOfClasses, weeklySchedule, room } = req.body;

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

        const existed = await TeachingAssignment.findOne({
            class_id,
            subject_id,
            semester_id
        })
        if (existed) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Môn học này đã được phân công cho lớp trong học kỳ này'
            })
        }
        for (const slot of weeklySchedule) {
            const conflict = await TeachingAssignment.findOne({
                semester_id,
                room,
                "weeklySchedule.dayOfWeek": slot.dayOfWeek,
                "weeklySchedule.startTime": { $lt: slot.endTime },
                "weeklySchedule.endTime": { $gt: slot.startTime },
            });

            if (conflict) {
                return res.status(400).json({
                    message: `Phòng ${room} đã được dùng vào thứ ${slot.dayOfWeek} từ ${slot.startTime} đến ${slot.endTime}`
                });
            }
        }
        const newAssignment = await TeachingAssignment.create({
            teacher_id,
            subject_id,
            class_id,
            semester_id,
            startDate,
            numberOfClasses,
            weeklySchedule,
            room,
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
            message: 'Thành công',
            data: techingassment
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
        const { id } = req.query;
        const oldAssignment = await TeachingAssignment.findById(id);
        if (!oldAssignment) {
            return res.status(400).json({ message: 'Not found' });
        }
        let updateData = { ...req.body };
        if (
            req.body.startDate ||
            req.body.numberOfClasses ||
            req.body.weeklySchedule
        ) {
            const startDate = req.body.startDate || oldAssignment.startDate;
            const numberOfClasses =
                req.body.numberOfClasses || oldAssignment.numberOfClasses;
            const weeklySchedule =
                req.body.weeklySchedule || oldAssignment.weeklySchedule;

            const generatedSchedule = generateSchedule(
                startDate,
                numberOfClasses,
                weeklySchedule
            );

            updateData.schedule = generatedSchedule;
        }

        const data = await TeachingAssignment.findByIdAndUpdate(id, updateData, {
            new: true,
        });

        return res.status(200).json({
            message: 'Cập nhật thành công',
            data,
        });
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