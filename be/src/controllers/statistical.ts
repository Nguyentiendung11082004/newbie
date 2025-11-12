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

export const AdminGetPayments = async (req: Request, res: Response) => {
    try {
      const { classId, subjectId, semesterId, page = "1", limit = "10" } = req.query;
      const pageNumber = parseInt(page as string, 10);
      const pageSize = parseInt(limit as string, 10);
  
      const query: any = {};
      if (classId) query["teaching_assignment_id.class_id"] = classId;
      if (subjectId) query["teaching_assignment_id.subject_id"] = subjectId;
      if (semesterId) query["teaching_assignment_id.semester_id"] = semesterId;
  
      const totalDocs = await Enrollment.countDocuments(query);
  
      const enrollments = await Enrollment.find(query)
        .populate({
          path: "student_id",
          select: "name StudentCode classId",
        })
        .populate({
          path: "teaching_assignment_id",
          populate: [
            { path: "subject_id", select: "name tuitionFee" },
            { path: "class_id", select: "ClassName" },
            { path: "semester_id", select: "name" },
            { path: "teacher_id", select: "name" },
          ],
        })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize);
  
      const result = enrollments.map((e: any) => ({
        studentName: e.student_id?.name,
        studentCode: e.student_id?.StudentCode,
        className: e.teaching_assignment_id?.class_id?.ClassName,
        subjectName: e.teaching_assignment_id?.subject_id?.name,
        tuitionFee: e.teaching_assignment_id?.subject_id?.tuitionFee || 0,
        status: e.status,
      }));
  
      const totalPages = Math.ceil(totalDocs / pageSize);
  
      return res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        message: "Thành công",
        data: {
            data: result,
            pagination: {
                totalDocs,
                totalPages,
                page: pageNumber,
                limit: pageSize,
              },
        },
        StatusCodes: StatusCodes.OK,
      });
    } catch (error) {
      handleError(res, error);
    }
  };
