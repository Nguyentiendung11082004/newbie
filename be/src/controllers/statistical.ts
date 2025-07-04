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
            message: 'Thành công',
            data: {
                student,
                teacher,
                subject,
                class: classcount,
                enrollment: enrollmentcount,
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
                $lookup: {
                    from: 'students',
                    localField: 'student_id',
                    foreignField: '_id',
                    as: 'student'
                }
            },
            { $unwind: '$student' },
            {
                $lookup: {
                    from: 'majors',
                    localField: 'student.major_id',
                    foreignField: '_id',
                    as: 'major'
                }
            },
            { $unwind: '$major' },
            {
                $lookup: {
                    from: 'semesters',
                    localField: 'teaching.semester_id',
                    foreignField: '_id',
                    as: 'semester'
                }
            },
            { $unwind: '$semester' },
            {
                $group: {
                    _id: {
                        semester: '$semester.name',
                        major: '$major.name'
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    semester: '$_id.semester',
                    major: '$_id.major',
                    count: 1
                }
            },
            { $sort: { semester: 1, major: 1 } }
        ]);

        console.log("result", result)
        res.status(StatusCodes.OK).json({
            message: 'Thành công',
            data: result
        });
    } catch (error) {
        handleError(res, error);
    }
};

export const GetStudentByMajor = async (req: Request, res: Response) => {
    try {
        const result = await Student.aggregate([
            {
                $lookup: {
                    from: 'majors',
                    localField: 'major_id',
                    foreignField: '_id',
                    as: 'major'
                }
            },
            { $unwind: '$major' },
            {
                $group: {
                    _id: '$major.name',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);
        res.status(StatusCodes.OK).json({
            message: 'Thành công',
            data: result.map(item => ({
                major: item._id,
                count: item.count
            }))
        })
    } catch (error) {
        handleError(res, error)
    }
}