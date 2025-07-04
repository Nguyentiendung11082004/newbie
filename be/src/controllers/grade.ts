import { Request, Response } from "express";
import { handleError } from "../middlewares/error";
import TeachingAssignment from "../model/teachingassignment";
import mongoose from "mongoose";
import { MOVED_TEMPORARILY, StatusCodes } from "http-status-codes";
import Enrollment from "../model/enrollment";
import Grade from "../model/grade";

interface IRequest extends Request {
    user: {
        _id: string;
        role: string;
        email: string;
        userId: string;
    };
}

interface student {
    name: string,
    _id: string,
    emmail: string
}
export const GetStudentListForGrading = async (req: IRequest, res: Response) => {
    try {
        const { class_id, subject_id, semester_id } = req.body;
        const { role, userId } = req.user;
        if (!class_id || !subject_id || !semester_id) {
            return res.status(400).json({
                message: 'Chưa đủ thông tin về class_id, subject_id, semester_id',
                StatusCodes: StatusCodes.BAD_REQUEST
            });
        }

        // hàm kiểm tra xem có đúng giảng vên này dạy lớp này không
        const assignment = await TeachingAssignment.findOne({
            class_id: new mongoose.Types.ObjectId(class_id as string),
            subject_id: new mongoose.Types.ObjectId(subject_id as string),
            semester_id: semester_id,
            teacher_id: userId,
        })
        if (!assignment) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Bạn không được nhập điểm lớp này',
                StatusCodes: StatusCodes.FORBIDDEN
            })
        }
        const enrollment = await Enrollment.find({
            teaching_assignment_id: assignment._id,
            status: 'Approved'
        }).populate('student_id', 'name StudentCode email');
        const grades = await Grade.find({
            class_id,
            subject_id,
            semester_id
        });
        console.log("grades", grades)
        const gradeMap = new Map();
        grades.forEach(g => {
            gradeMap.set(g.student_id.toString(), g);
        });
        const dataStudent = enrollment.map((e: any) => {
            const grade = gradeMap.get(e.student_id._id.toString());
            return {
                student_id: e.student_id._id,
                name: e.student_id.name,
                email: e.student_id.email,
                StudentCode: e.student_id.StudentCode,
                processScore: grade?.processScore ?? null,
                midtermScore: grade?.midtermScore ?? null,
                finalScore: grade?.finalScore ?? null,
                averageScore: grade?.averageScore ?? null,
                status: grade?.status ?? null
            };
        });


        return res.status(StatusCodes.OK).json({
            message: "Thành công",
            data: dataStudent,
            StatusCodes: StatusCodes.OK
        })
    } catch (error) {
        handleError(res, error)
    }
}

export const CreateGrade = async (req: IRequest, res: Response) => {
    try {
        const { class_id, subject_id, semester_id, grades } = req.body;
        const { userId: teacher_id } = req.user;
        if (!class_id || !subject_id || !semester_id || !grades || !Array.isArray(grades)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: 'Thiếu thông tin class_id, subject_id, semester hoặc danh sách grades.'
            });
        }
        const assignment = await TeachingAssignment.findOne({
            class_id: new mongoose.Types.ObjectId(class_id),
            subject_id: new mongoose.Types.ObjectId(subject_id),
            semester_id: new mongoose.Types.ObjectId(semester_id),
            teacher_id: new mongoose.Types.ObjectId(teacher_id),
        });
        console.log("assignment",assignment)
        if (!assignment) {
            return res.status(StatusCodes.FORBIDDEN).json({
                success: false,
                message: 'Bạn không được phép nhập điểm cho lớp hoặc môn học này trong học kỳ này.'
            });
        }
        const bulkGrades: any = [];
        for (const g of grades) {
            const { student_id, processScore, midtermScore, finalScore } = g;

            if (!student_id || processScore == null || midtermScore == null || finalScore == null) {
                continue;
            }

            const averageScore = parseFloat((
                (processScore * 0.3) +
                (midtermScore * 0.3) +
                (finalScore * 0.4)
            ).toFixed(2));

            const filter = {
                student_id: new mongoose.Types.ObjectId(student_id),
                subject_id: new mongoose.Types.ObjectId(subject_id),
                semester_id: new mongoose.Types.ObjectId(semester_id),
            };

            const status = averageScore >= 5 ? 'pass' : 'fail';
            const update = {
                $set: {
                    class_id,
                    teacher_id,
                    semester_id,
                    processScore,
                    midtermScore,
                    finalScore,
                    averageScore,
                    status: status
                }
            };

            await Grade.updateOne(filter, update, { upsert: true });
        }
        const result = await Grade.insertMany(bulkGrades);
        return res.status(StatusCodes.CREATED).json({
            StatusCodes: StatusCodes.OK,
            message: 'Nhập điểm thành công.',
            data: result
        });

    } catch (error) {
        handleError(res, error);
    }
};
export const GetMyGrades = async (req: IRequest, res: Response) => {
    try {
        const { subject_id, class_id } = req.body;
        const { userId } = req.user;

        const filter: any = {
            student_id: userId
        }
        if (subject_id) {
            filter.subject_id = subject_id;
        }
        if (class_id) {
            filter.class_id = class_id;
        }

        const grades = await Grade.find(filter)
            .populate('subject_id', 'name')
            .populate('class_id', 'name')
            .populate('teacher_id', 'name email');

        return res.status(200).json({
            success: true,
            message: 'Lấy bảng điểm thành công',
            data: grades
        });
    } catch (error) {
        handleError(res, error)
    }
}