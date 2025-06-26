import { Request, Response } from "express"
import { handleError } from "../middlewares/error"
import Student from "../model/student"
import Teacher from "../model/teacher"
import Subject from "../model/subject";
import Class from "../model/class";
import Enrollment from "../model/enrollment";
import { StatusCodes } from "http-status-codes";
export const GetAdminSumary = async (req: Request, res: Response) => {
    try {
        const [student, teacher, subject, classcount, enrollmentcount] = await Promise.all([
            Student.countDocuments(),
            Teacher.countDocuments(),
            Subject.countDocuments(),
            Class.countDocuments(),
            Enrollment.countDocuments()
        ])
        res.status(StatusCodes.OK).json({
            data: {
                message: 'Thành công',
                data: {
                    student,
                    teacher,
                    subject,
                    class: classcount,
                    enrollment: enrollmentcount,
                }
            }
        })
    } catch (error) {
        handleError(res, error)
    }
}

export const GetEnrollmentBySemester = async (req: Request, res: Response) => {
    try {
        const result = await Enrollment.aggregate([
            { $match: { status: 'Approved' } },
            {
                $lookup: {
                    from: 'teachingassignments',
                    localField: 'teaching_assignment_id',
                    foreignField: '_id',
                    as: 'teaching'
                }
            },
            { $unwind: '$teaching' },
            {
                $group: {
                    _id: '$teaching.semester',
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        const formatted = result.map(item => ({
            semester: item._id,
            count: item.count
        }));
        res.status(StatusCodes.OK).json({
            data: {
                message: 'Thành công',
                data: formatted
            }
        })
    } catch (error) {
        handleError(res, error);
    }
};
export const GetStudentByMajor = async (req: Request, res: Response) => {
    try {
        const result = await Student.aggregate([
            {
                $lookup: {
                    from: 'classes',
                    localField: 'class_id',
                    foreignField: '_id',
                    as: 'class'
                }
            },
            // { $unwind: '$class' },
            {
                $group: {
                    _id: '$class.name',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ])
        res.status(StatusCodes.OK).json({
            data: {
                message: 'Thành công',
                data: result.map(item => ({
                    major: item._id,
                    count: item.count
                }))
            }
        })
    } catch (error) {
        handleError(res, error)
    }
}