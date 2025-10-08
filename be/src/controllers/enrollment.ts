import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Types } from "mongoose";
import { handleError } from "../middlewares/error";
import { addTransaction } from "../middlewares/wallet";
import Attendance from "../model/attdance";
import Enrollment from "../model/enrollment";
import Student from "../model/student";
import StudentWallet from "../model/studentwallets";
import { default as TeachingAssignment, default as TeachingAssignmentSchema } from "../model/teachingassignment";
import { EnrollmentValidate } from "../schema/enrolment";
import { sendMail } from "../middlewares/email";
interface CustomRequest extends Request {
    user: {
        _id: string;
        role: string;
        email: string;
        userId: string;
    };
}
export const getAllEnrollSubject = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const {
            _page = 1,
            _limit = 10,
            _sort = "createdAt",
            _order = "asc",
        } = req.body;
        const query: any = {};
        const options = {
            page: parseInt(_page),
            limit: parseInt(_limit),
            sort: { [_sort]: _order === 'asc' ? 1 : -1 }
        };
        const students = await Enrollment.paginate(query, options);
        res.status(StatusCodes.OK).json({
            message: 'Thành công',
            data: students.docs,
            pagination: {
                totalDocs: students.totalDocs,
                totalPages: students.totalPages,
                page: students.page,
                limit: students.limit
            }
        })

    } catch (error) {
        handleError(res, error);
    }
}
export const getTeachingAssignmentsForEnroll = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const { subject_id, teacher_id } = req.body;
        const query: any = {};
        if (subject_id) query.subject_id = subject_id;
        if (teacher_id) query.teacher_id = teacher_id;

        const assignments = await TeachingAssignment.find(query)
            .populate('subject_id')
            .populate('teacher_id')
            .populate('class_id');

        if (!assignments) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Không có lớp giảng dạy phù hợp',
                data: assignments,
            });
        }
        return res.status(StatusCodes.OK).json({
            message: 'Danh sách lớp giảng dạy phù hợp',
            data: assignments,
        });
    } catch (error) {
        handleError(res, error);
    }
}

export const getEnrollSubject = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const { student_id } = req.body;
        if (!Types.ObjectId.isValid(student_id)) {
            return res.status(400).json({ message: "student_id không hợp lệ" });
        }
        // const enrollments = await Enrollment.find({
        //     student_id: Types.ObjectId.createFromHexString(student_id),
        // }).populate('teaching_assignment_id', 'name subject_id semester').exec();
        const enrollments = await Enrollment.find({ student_id })
            .populate({
                path: 'teaching_assignment_id',
                populate: [
                    { path: 'subject_id', model: 'Subject' },       // Lấy thông tin môn học
                    { path: 'teacher_id', model: 'Teacher' },       // (tuỳ chọn) Lấy giảng viên
                    { path: 'class_id', model: 'Class' }            // (tuỳ chọn) Lấy lớp học
                ]
            });

        return res.status(StatusCodes.OK).json({
            message: 'Thành công',
            data: enrollments,
        })
    } catch (error) {
        handleError(res, error)
    }
}
export const CreateEnrollSubject = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const { student_id, subject_id, teacher_id } = req.body;
        const validate = EnrollmentValidate.validate(req.body, { abortEarly: false, allowUnknown: true });
        if (validate.error) {
            const errors = validate.error.details.map((e: any) => (
                {
                    field: e.path[0],
                    message: e.message
                }
            ));
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                errors
            });
        }
        const student = await Student.findById(student_id);
        if (!student) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Sinh viên không tồn tại'
            });
        }
        const teachingAssignment = await TeachingAssignmentSchema.findOne({
            subject_id,
            teacher_id
        });
        if (!teachingAssignment) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Không tìm thấy phân công giảng dạy tương ứng với môn học và giảng viên đã chọn.'
            });
        }
        const exitEnrollment = await Enrollment.findOne({ student_id, teaching_assignment_id: teachingAssignment._id });
        if (exitEnrollment) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Sinh viên đã ghi danh môn học này." });
        }
        const enrolledCount = await Enrollment.countDocuments({
            teaching_assignment_id: teachingAssignment._id,
            status: { $in: ['Approved', 'Pending'] },
        })
        if (enrolledCount >= teachingAssignment.maxStudent) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Lớp học đã đầy, không thể ghi danh thêm.'
            });
        }
        const enrollment = await Enrollment.create({
            student_id,
            teaching_assignment_id: teachingAssignment._id,
            status: 'Pending',
            enrolled_at: new Date()
        });
        const class_id = teachingAssignment.class_id;
        // Cập nhật vào mảng classId của sinh viên (nếu chưa có)
        await Student.updateOne(
            { _id: student_id },
            { $addToSet: { classId: class_id } }  // tránh thêm trùng
        );
        return res.status(StatusCodes.OK).json({
            data: {
                message: 'Đăng ký môn học thành công.',
                data: enrollment
            }
        });

    } catch (error) {
        handleError(res, error);
    }
}
export const updateEnrollSubject = async (req: Request, res: Response) => {
    try {
        const enrollsubject = await Enrollment.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        })
        if (!enrollsubject) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "Không tìm thấy enrollsubject"
            })
        }
        return res.status(StatusCodes.OK).json({
            data: {
                message: "Thành công",
                data: enrollsubject
            }
        })
    } catch (error) {
        handleError(res, error)
    }
}
export const DeleteEnroll = async (req: Request, res: Response) => {
    try {
        const enroll = await Enrollment.findById(req.params.id);
        if (!enroll) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "Không tìm thấy ghi danh"
            });
        }

        if (enroll.status === "Approved") {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Môn học đã được thanh toán, không thể huỷ"
            });
        }

        // Nếu chưa thanh toán thì xoá ghi danh
        await Enrollment.findByIdAndDelete(req.params.id);

        return res.status(StatusCodes.OK).json({
            message: "Huỷ ghi danh thành công"
        });
    } catch (error) {
        handleError(res, error);
    }
};

export const GetEnrollmentByTeacher = async (req: Request, res: Response) => {
    try {
        const { teacher_id, status = 'Pending', page = 1, limit = 10 } = req.body;
        const assignments = await TeachingAssignment.find({ teacher_id });
        const assignmentIds = assignments.map(a => a._id);
        const skip = (page - 1) * limit;
        const [enrollments, total] = await Promise.all([
            Enrollment.find({
                teaching_assignment_id: { $in: assignmentIds },
                status
            })
                .skip(skip)
                .limit(limit)
                .populate([
                    { path: 'student_id', select: 'name email' },
                    {
                        path: 'teaching_assignment_id',
                        populate: [
                            { path: 'subject_id', select: 'name' },
                            { path: 'class_id', select: 'name' },
                        ]
                    }
                ]),
            Enrollment.countDocuments({
                teaching_assignment_id: { $in: assignmentIds },
                status
            })
        ]);
        return res.status(StatusCodes.OK).json({
            data: {
                message: 'Thành công',
                data: enrollments,
                pagination: {
                    total,
                    page: Number(page),
                    limit: Number(limit)
                }
            }
        });
    } catch (error) {
        handleError(res, error)
    }
}
export const GetEnrollmentsByTeachingAssignment = async (req: Request, res: Response) => {
    try {
        const { teaching_assignment_id, date } = req.body;

        if (!Types.ObjectId.isValid(teaching_assignment_id)) {
            return res.status(400).json({ message: 'teaching_assignment_id không hợp lệ' });
        }

        // Lấy danh sách ghi danh
        const enrollments = await Enrollment.find({ teaching_assignment_id,status: 'Approved' })
            .populate('student_id', 'name email') // Lấy name + email nếu cần

        // Lấy danh sách điểm danh ứng với teaching_assignment_id + date
        const attendanceRecords = await Attendance.find();

        // Map điểm danh theo student_id cho tiện tra cứu
        const attendanceMap = new Map();
        attendanceRecords.forEach((record: any) => {
            record.attendances.forEach((att: any) => {
                attendanceMap.set(att.student_id.toString(), {
                    status: att.status,
                    note: att.note,
                });
            });
        });
        // Gộp trạng thái điểm danh vào từng sinh viên
        const result = enrollments.map((enrollment) => {
            const studentId = enrollment.student_id._id.toString();
            const attendance = attendanceMap.get(studentId);
            return {
                ...enrollment.toObject(),
                status: attendance?.status || 'absent',
                // attendance_note: attendance?.note || '',
            };
        });

        return res.status(200).json({
            message: 'Thành công',
            data: result
        });

    } catch (error) {
        handleError(res, error);
    }
}

export const PayForEnrollment = async (req: CustomRequest, res: Response) => {
    try {
        const { userId } = req.user;
        const { IdEnrollment } = req.body;

        const enrollment = await Enrollment.findById(IdEnrollment)
            .populate({
                path: 'teaching_assignment_id',
                populate: {
                    path: 'subject_id',
                    model: 'Subject',
                }
            })
            .populate('student_id');
        if (!enrollment) {
            return res.status(404).json({ message: 'Không tìm thấy ghi danh.' });
        }

        if (enrollment.student_id._id.toString() !== userId) {
            return res.status(403).json({ message: 'Bạn không có quyền thanh toán ghi danh này.' });
        }

        if (enrollment.status !== 'Pending') {
            return res.status(400).json({ message: 'Ghi danh đã được thanh toán hoặc không còn hiệu lực.' });
        }
        const teachingAssignment: any = enrollment.teaching_assignment_id as any;
        const subject: any = teachingAssignment.subject_id;
        const tuitionFee = subject.tuitionFee;


        const wallet = await StudentWallet.findOne({ student_id: userId });
        if (!wallet || wallet.balance < tuitionFee) {
            return res.status(400).json({ message: 'Số dư không đủ để thanh toán học phí.' });
        }
        // Trừ tiền
        wallet.balance -= tuitionFee;
        await wallet.save();

        // Ghi lịch sử giao dịch
        await addTransaction(userId, {
            amount: tuitionFee,
            type: 'payment',
            description: `Thanh toán học phí môn ${subject.name}`,
        });

        // Cập nhật trạng thái ghi danh
        enrollment.status = 'Approved';
        await enrollment.save();
        const tenhs: any = enrollment.student_id;
        const monhoc: any = (enrollment.teaching_assignment_id as any).subject_id;
        await sendMail(
            tenhs.email,
            'Thanh toán ghi danh thành công',
            `<h3>Xin chào ${tenhs.name},</h3>
             <p>Bạn đã thanh toán thành công học phí cho môn <strong>${monhoc.name}</strong>.</p>
             <p>Mã lớp: ${monhoc.code}</p>
             <p>Cảm ơn bạn!</p>`
        );
        return res.status(200).json({ message: 'Thanh toán thành công.' });

    } catch (error) {
        handleError(res, error);
    }
};
export const GetPaymentStatus = async (req: Request, res: Response) => {
    try {
        const { TeachingAssignmentId, classId, subjectId, paymentStatus } = req.body;

        let teachingAssignmentIds: any[] = [];

        if (TeachingAssignmentId) {
            teachingAssignmentIds = [TeachingAssignmentId];
        } else {
            const fil: any = {};
            if (classId) fil.class_id = classId;
            if (subjectId) fil.subject_id = subjectId;

            const assignments = await TeachingAssignment.find(fil).select("_id");
            teachingAssignmentIds = assignments.map(a => a._id);
        }

        const enrollmentFilter: any = {
            teaching_assignment_id: { $in: teachingAssignmentIds },
            status: { $in: ["Approved", "Pending"] }
        };

        if (paymentStatus) enrollmentFilter.paymentStatus = paymentStatus;

        const enrollments = await Enrollment.find(enrollmentFilter)
            .populate("student_id", "name StudentCode")
            .populate({
                path: "teaching_assignment_id",
                populate: [
                    { path: "subject_id", select: "name" },
                    { path: "class_id", select: "ClassName" }
                ]
            });
        const data = enrollments.map((enroll: any) => ({
            studentName: enroll.student_id.name,
            studentCode: enroll.student_id.StudentCode,
            subject: enroll.teaching_assignment_id.subject_id.name,
            class: enroll.teaching_assignment_id.class_id.ClassName,
            paymentStatus: enroll.paymentStatus,
            enrollmentStatus: enroll.status
        }));
        res.status(200).json({ message: 'Lấy trạng thái thanh toán thành công.', data });
    } catch (err) {
        console.error("GetPaymentStatus error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};
