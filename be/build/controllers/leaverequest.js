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
exports.ApproveLeave = exports.CreateLeave = exports.GetAllLeave = void 0;
const error_1 = require("../middlewares/error");
const leaverequest_1 = __importDefault(require("../model/leaverequest"));
const http_status_codes_1 = require("http-status-codes");
const teachingassignment_1 = __importDefault(require("../model/teachingassignment"));
const teacher_1 = __importDefault(require("../model/teacher"));
const sse_route_1 = require("../routes/sse.route");
const GetAllLeave = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { _page = '1', _limit = '10', _sort = 'createAt', _order = 'asc', status, fromDate, toDate, } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const role = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role;
        const filter = {};
        if (role === 'teacher') {
            const assignments = yield teachingassignment_1.default.find({ teacher_id: userId });
            const teachingIds = assignments.map(a => a._id);
            if (teachingIds.length === 0) {
                return res.status(http_status_codes_1.StatusCodes.OK).json({
                    message: 'Không có lớp nào đang dạy',
                    StatusCodes: http_status_codes_1.StatusCodes.OK,
                    data: [],
                    pagination: {
                        totalDocs: 0,
                        totalPages: 0,
                        page: parseInt(_page),
                        limit: parseInt(_limit),
                    }
                });
            }
            filter.teaching_assignment_id = { $in: teachingIds };
        }
        if (role === 'student') {
            filter.student_id = userId;
        }
        if (status)
            filter.status = status;
        if (fromDate || toDate) {
            filter.fromDate = {};
            if (fromDate)
                filter.fromDate.$gte = new Date(fromDate);
            if (toDate)
                filter.fromDate.$lte = new Date(toDate);
        }
        const options = {
            page: parseInt(_page),
            limit: parseInt(_limit),
            sort: { [_sort]: _order === 'asc' ? 1 : -1 },
            populate: [
                {
                    path: 'teaching_assignment_id',
                    populate: [
                        { path: 'subject_id', select: 'name' },
                        { path: 'class_id', select: 'ClassName' },
                    ]
                },
                { path: 'student_id', select: 'name studentCode' }
            ]
        };
        const leave = yield leaverequest_1.default.paginate(filter, options);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            message: 'Thành công',
            StatusCodes: http_status_codes_1.StatusCodes.OK,
            data: leave.docs,
            pagination: {
                totalDocs: leave.totalDocs,
                totalPages: leave.totalPages,
                page: leave.page,
                limit: leave.limit
            }
        });
    }
    catch (error) {
        (0, error_1.handleError)(res, error);
    }
});
exports.GetAllLeave = GetAllLeave;
const CreateLeave = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.user;
        const { reason, fromDate, toDate, teaching_assignment_id } = req.body;
        if (new Date(fromDate) > new Date(toDate)) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                message: "Từ ngày phải nhỏ hơn hoặc bằng đến ngày"
            });
        }
        const assignment = yield teachingassignment_1.default.findById(teaching_assignment_id);
        if (!assignment) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                message: "Môn học không hợp lệ"
            });
        }
        const leave = yield leaverequest_1.default.create({
            student_id: userId,
            reason,
            fromDate,
            toDate,
            teaching_assignment_id,
            status: 'pending'
        });
        return res.status(http_status_codes_1.StatusCodes.CREATED).json({
            data: leave,
            StatusCodes: http_status_codes_1.StatusCodes.CREATED,
            message: "Gửi đơn nghỉ thành công"
        });
    }
    catch (error) {
        (0, error_1.handleError)(res, error);
    }
});
exports.CreateLeave = CreateLeave;
const ApproveLeave = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { userId } = req.user;
        const teacher = yield teacher_1.default.findById(userId);
        if (!teacher) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                message: "Chỉ giảng viên mới có quyền duyệt"
            });
        }
        const { leaveId } = req.body;
        const leave = yield leaverequest_1.default.findById(leaveId)
            .populate({
            path: 'teaching_assignment_id',
            select: 'teacher_id',
        });
        if (!leave) {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                message: "Không tìm thấy đơn xin nghỉ"
            });
        }
        if (((_a = leave.teaching_assignment_id) === null || _a === void 0 ? void 0 : _a.teacher_id.toString()) !== userId) {
            return res.status(403).json({ message: "Bạn không có quyền duyệt đơn này" });
        }
        leave.status = "approved";
        yield leave.save();
        (0, sse_route_1.sendSSEToStudent)(leave.student_id.toString(), 'Đơn xin nghỉ đã được duyệt');
        return res.status(http_status_codes_1.StatusCodes.OK).json({ message: "Duyệt đơn nghỉ thành công", StatusCodes: http_status_codes_1.StatusCodes.OK, leave });
    }
    catch (error) {
        (0, error_1.handleError)(res, error);
    }
});
exports.ApproveLeave = ApproveLeave;
