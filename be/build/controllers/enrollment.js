"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPaymentStatus = exports.PayForEnrollment = exports.GetEnrollmentsByTeachingAssignment = exports.GetEnrollmentByTeacher = exports.DeleteEnroll = exports.updateEnrollSubject = exports.CreateEnrollSubject = exports.getEnrollSubject = exports.getTeachingAssignmentsForEnroll = exports.getAllEnrollSubject = void 0;
const http_status_codes_1 = require("http-status-codes");
const mongoose_1 = require("mongoose");
const error_1 = require("../middlewares/error");
const wallet_1 = require("../middlewares/wallet");
const attdance_1 = __importDefault(require("../model/attdance"));
const enrollment_1 = __importDefault(require("../model/enrollment"));
const student_1 = __importDefault(require("../model/student"));
const studentwallets_1 = __importDefault(require("../model/studentwallets"));
const teachingassignment_1 = __importDefault(require("../model/teachingassignment"));
const enrolment_1 = require("../schema/enrolment");
const email_1 = require("../middlewares/email");
const getAllEnrollSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _page = 1, _limit = 10, _sort = "createdAt", _order = "asc", } = req.body;
        const query = {};
        const options = {
            page: parseInt(_page),
            limit: parseInt(_limit),
            sort: { [_sort]: _order === 'asc' ? 1 : -1 }
        };
        const students = yield enrollment_1.default.paginate(query, options);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            message: 'Thành công',
            data: students.docs,
            pagination: {
                totalDocs: students.totalDocs,
                totalPages: students.totalPages,
                page: students.page,
                limit: students.limit
            }
        });
    }
    catch (error) {
        (0, error_1.handleError)(res, error);
    }
});
exports.getAllEnrollSubject = getAllEnrollSubject;
const getTeachingAssignmentsForEnroll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { subject_id, teacher_id } = req.body;
        const query = {};
        if (subject_id)
            query.subject_id = subject_id;
        if (teacher_id)
            query.teacher_id = teacher_id;
        const assignments = yield teachingassignment_1.default.find(query)
            .populate('subject_id')
            .populate('teacher_id')
            .populate('class_id')
            .populate('semester_id');
        if (!assignments) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                message: 'Không có lớp giảng dạy phù hợp',
                data: assignments,
            });
        }
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            message: 'Danh sách lớp giảng dạy phù hợp',
            data: assignments,
        });
    }
    catch (error) {
        (0, error_1.handleError)(res, error);
    }
});
exports.getTeachingAssignmentsForEnroll = getTeachingAssignmentsForEnroll;
const getEnrollSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { student_id } = req.body;
        if (!mongoose_1.Types.ObjectId.isValid(student_id)) {
            return res.status(400).json({ message: "student_id không hợp lệ" });
        }
        // const enrollments = await Enrollment.find({
        //     student_id: Types.ObjectId.createFromHexString(student_id),
        // }).populate('teaching_assignment_id', 'name subject_id semester').exec();
        const enrollments = yield enrollment_1.default.find({ student_id })
            .populate({
            path: 'teaching_assignment_id',
            populate: [
                { path: 'subject_id', model: 'Subject' }, // Lấy thông tin môn học
                { path: 'teacher_id', model: 'Teacher' }, // (tuỳ chọn) Lấy giảng viên
                { path: 'class_id', model: 'Class' } // (tuỳ chọn) Lấy lớp học
            ]
        });
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            message: 'Thành công',
            data: enrollments,
        });
    }
    catch (error) {
        (0, error_1.handleError)(res, error);
    }
});
exports.getEnrollSubject = getEnrollSubject;
const CreateEnrollSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { student_id, subject_id, teacher_id } = req.body;
        const validate = enrolment_1.EnrollmentValidate.validate(req.body, { abortEarly: false, allowUnknown: true });
        if (validate.error) {
            const errors = validate.error.details.map((e) => ({
                field: e.path[0],
                message: e.message
            }));
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                success: false,
                errors
            });
        }
        const student = yield student_1.default.findById(student_id);
        if (!student) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                message: 'Sinh viên không tồn tại'
            });
        }
        const teachingAssignment = yield teachingassignment_1.default.findOne({
            subject_id,
            teacher_id
        });
        if (!teachingAssignment) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                message: 'Không tìm thấy phân công giảng dạy tương ứng với môn học và giảng viên đã chọn.'
            });
        }
        const exitEnrollment = yield enrollment_1.default.findOne({ student_id, teaching_assignment_id: teachingAssignment._id });
        if (exitEnrollment) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: "Sinh viên đã ghi danh môn học này." });
        }
        const enrolledCount = yield enrollment_1.default.countDocuments({
            teaching_assignment_id: teachingAssignment._id,
            status: { $in: ['Approved', 'Pending'] },
        });
        if (enrolledCount >= teachingAssignment.maxStudent) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                message: 'Lớp học đã đầy, không thể ghi danh thêm.'
            });
        }
        const enrollment = yield enrollment_1.default.create({
            student_id,
            teaching_assignment_id: teachingAssignment._id,
            status: 'Pending',
            enrolled_at: new Date(),
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });
        const class_id = teachingAssignment.class_id;
        // Cập nhật vào mảng classId của sinh viên (nếu chưa có)
        yield student_1.default.updateOne({ _id: student_id }, { $addToSet: { classId: class_id } } // tránh thêm trùng
        );
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            data: {
                message: 'Đăng ký môn học thành công.',
                data: enrollment
            }
        });
    }
    catch (error) {
        (0, error_1.handleError)(res, error);
    }
});
exports.CreateEnrollSubject = CreateEnrollSubject;
const updateEnrollSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const enrollsubject = yield enrollment_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!enrollsubject) {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                message: "Không tìm thấy enrollsubject"
            });
        }
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            data: {
                message: "Thành công",
                data: enrollsubject
            }
        });
    }
    catch (error) {
        (0, error_1.handleError)(res, error);
    }
});
exports.updateEnrollSubject = updateEnrollSubject;
const DeleteEnroll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const enroll = yield enrollment_1.default.findById(req.params.id);
        if (!enroll) {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                message: "Không tìm thấy ghi danh"
            });
        }
        if (enroll.status === "Approved") {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                message: "Môn học đã được thanh toán, không thể huỷ"
            });
        }
        // Nếu chưa thanh toán thì xoá ghi danh
        yield enrollment_1.default.findByIdAndDelete(req.params.id);
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            message: "Huỷ ghi danh thành công"
        });
    }
    catch (error) {
        (0, error_1.handleError)(res, error);
    }
});
exports.DeleteEnroll = DeleteEnroll;
const GetEnrollmentByTeacher = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { teacher_id, status = 'Pending', page = 1, limit = 10 } = req.body;
        const assignments = yield teachingassignment_1.default.find({ teacher_id });
        const assignmentIds = assignments.map(a => a._id);
        const skip = (page - 1) * limit;
        const [enrollments, total] = yield Promise.all([
            enrollment_1.default.find({
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
            enrollment_1.default.countDocuments({
                teaching_assignment_id: { $in: assignmentIds },
                status
            })
        ]);
        return res.status(http_status_codes_1.StatusCodes.OK).json({
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
    }
    catch (error) {
        (0, error_1.handleError)(res, error);
    }
});
exports.GetEnrollmentByTeacher = GetEnrollmentByTeacher;
const GetEnrollmentsByTeachingAssignment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { teaching_assignment_id, date } = req.body;
        if (!mongoose_1.Types.ObjectId.isValid(teaching_assignment_id)) {
            return res.status(400).json({ message: 'teaching_assignment_id không hợp lệ' });
        }
        // Lấy danh sách ghi danh
        const enrollments = yield enrollment_1.default.find({ teaching_assignment_id, status: 'Approved' })
            .populate('student_id', 'name email'); // Lấy name + email nếu cần
        // Lấy danh sách điểm danh ứng với teaching_assignment_id + date
        const attendanceRecords = yield attdance_1.default.find();
        // Map điểm danh theo student_id cho tiện tra cứu
        const attendanceMap = new Map();
        attendanceRecords.forEach((record) => {
            record.attendances.forEach((att) => {
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
            return Object.assign(Object.assign({}, enrollment.toObject()), { status: (attendance === null || attendance === void 0 ? void 0 : attendance.status) || 'absent' });
        });
        return res.status(200).json({
            message: 'Thành công',
            data: result
        });
    }
    catch (error) {
        (0, error_1.handleError)(res, error);
    }
});
exports.GetEnrollmentsByTeachingAssignment = GetEnrollmentsByTeachingAssignment;
const PayForEnrollment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.user;
        const { IdEnrollment } = req.body;
        const enrollment = yield enrollment_1.default.findById(IdEnrollment)
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
        const teachingAssignment = enrollment.teaching_assignment_id;
        const subject = teachingAssignment.subject_id;
        const tuitionFee = subject.tuitionFee;
        const wallet = yield studentwallets_1.default.findOne({ student_id: userId });
        if (!wallet || wallet.balance < tuitionFee) {
            return res.status(400).json({ message: 'Số dư không đủ để thanh toán học phí.' });
        }
        // Trừ tiền
        wallet.balance -= tuitionFee;
        yield wallet.save();
        // Ghi lịch sử giao dịch
        yield (0, wallet_1.addTransaction)(userId, {
            amount: tuitionFee,
            type: 'payment',
            description: `Thanh toán học phí môn ${subject.name}`,
        });
        // Cập nhật trạng thái ghi danh
        enrollment.status = 'Approved';
        yield enrollment.save();
        const tenhs = enrollment.student_id;
        const monhoc = enrollment.teaching_assignment_id.subject_id;
        yield (0, email_1.sendMail)(tenhs.email, 'Thanh toán thành công', `<h3>Xin chào ${tenhs.name},</h3>
             <p>Bạn đã thanh toán thành công học phí
              cho môn <strong>${monhoc.name}</strong>.</p>
             <p>Mã lớp: ${monhoc.code}</p>
             <p>Cảm ơn bạn!</p>`);
        return res.status(200).json({ message: 'Thanh toán thành công.' });
    }
    catch (error) {
        (0, error_1.handleError)(res, error);
    }
});
exports.PayForEnrollment = PayForEnrollment;
const GetPaymentStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { TeachingAssignmentId, classId, subjectId, paymentStatus } = req.body;
        let teachingAssignmentIds = [];
        if (TeachingAssignmentId) {
            teachingAssignmentIds = [TeachingAssignmentId];
        }
        else {
            const fil = {};
            if (classId)
                fil.class_id = classId;
            if (subjectId)
                fil.subject_id = subjectId;
            const assignments = yield teachingassignment_1.default.find(fil).select("_id");
            teachingAssignmentIds = assignments.map(a => a._id);
        }
        const enrollmentFilter = {
            teaching_assignment_id: { $in: teachingAssignmentIds },
            status: { $in: ["Approved", "Pending"] }
        };
        if (paymentStatus)
            enrollmentFilter.paymentStatus = paymentStatus;
        const enrollments = yield enrollment_1.default.find(enrollmentFilter)
            .populate("student_id", "name StudentCode")
            .populate({
            path: "teaching_assignment_id",
            populate: [
                { path: "subject_id", select: "name" },
                { path: "class_id", select: "ClassName" }
            ]
        });
        const data = enrollments.map((enroll) => ({
            studentName: enroll.student_id.name,
            studentCode: enroll.student_id.StudentCode,
            subject: enroll.teaching_assignment_id.subject_id.name,
            class: enroll.teaching_assignment_id.class_id.ClassName,
            paymentStatus: enroll.paymentStatus,
            enrollmentStatus: enroll.status
        }));
        res.status(200).json({ message: 'Lấy trạng thái thanh toán thành công.', data });
    }
    catch (err) {
        console.error("GetPaymentStatus error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.GetPaymentStatus = GetPaymentStatus;
