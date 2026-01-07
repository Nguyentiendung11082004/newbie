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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteNotification = exports.UpdateNotification = exports.CreateNotification = exports.GetNotificationById = exports.GetNotification = void 0;
const error_1 = require("../middlewares/error");
const notification_1 = __importDefault(require("../model/notification"));
const http_status_codes_1 = require("http-status-codes");
const teachingassignment_1 = __importDefault(require("../model/teachingassignment"));
const teacher_1 = __importDefault(require("../model/teacher"));
const GetNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { role, userId, class_id, subjects } = req.user;
        const { keyword, classFilter } = req.query;
        let query = {};
        if (role === "admin") {
            if (keyword) {
                query.title = { $regex: keyword.toString(), $options: "i" };
            }
            if (classFilter) {
                query.class_id = classFilter.toString();
            }
        }
        else if (role === "teacher") {
            query.sender_role = "teacher";
            query.sender_id = userId;
            if (keyword) {
                query.title = { $regex: keyword.toString(), $options: "i" };
            }
            if (classFilter) {
                query.class_id = classFilter.toString();
            }
        }
        else if (role === "student") {
            query.$or = [
                { target_type: "all" },
                { target_type: "student" },
                { target_type: "class", class_id: class_id },
                { target_type: "subject", subject_id: { $in: subjects || [] } },
            ];
        }
        const data = yield notification_1.default.find()
            // .sort({ createdAt: -1 })
            .populate("sender_id", "email");
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            message: "Thành công",
            data,
        });
    }
    catch (error) {
        (0, error_1.handleError)(res, error);
    }
});
exports.GetNotification = GetNotification;
const GetNotificationById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield notification_1.default.findById(req.params.id);
        if (!data) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                message: "Not found"
            });
        }
        res.status(http_status_codes_1.StatusCodes.OK).json({
            message: "Thành công",
            data,
        });
    }
    catch (error) {
        (0, error_1.handleError)(res, error);
    }
});
exports.GetNotificationById = GetNotificationById;
const CreateNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { role, userId, _id } = req.user;
        let { title, content, target_type, class_id, student_ids } = req.body;
        if (!title || !content) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                message: "Thiếu tiêu đề hoặc nội dung "
            });
        }
        const roleUser = role === null || role === void 0 ? void 0 : role.toLowerCase();
        let target = target_type === null || target_type === void 0 ? void 0 : target_type.toLowerCase();
        let senderAuthId = userId;
        if (roleUser === "teacher") {
            if (target === "all") {
                return res.status(403).json({
                    message: "Giảng viên không được gửi thông báo toàn hệ thống",
                });
            }
            if (!class_id) {
                return res.status(400).json({ message: "Thiếu class_id" });
            }
            const check = yield teachingassignment_1.default.findOne({
                teacher_id: userId,
                class_id: class_id,
            });
            if (!check) {
                return res.status(403).json({
                    message: "Bạn không có quyền gửi thông báo đến lớp này",
                });
            }
            const teacher = yield teacher_1.default.findById(userId).select("authId");
            if (!teacher) {
                return res.status(404).json({ message: "Không tìm thấy" });
            }
            senderAuthId = teacher.authId;
            target_type = "class";
        }
        const noti = yield notification_1.default.create({
            title,
            content,
            target_type,
            class_id,
            student_ids,
            sender_id: senderAuthId,
            sender_role: role,
        });
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            message: "Thêm thông báo thành công",
            noti,
        });
    }
    catch (error) {
        (0, error_1.handleError)(res, error);
    }
});
exports.CreateNotification = CreateNotification;
const UpdateNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _a = req.body, { _id } = _a, updateData = __rest(_a, ["_id"]);
        if (!_id) {
            return res.status(400).json({ message: "Thiếu id thông báo" });
        }
        const data = yield notification_1.default.findByIdAndUpdate(_id, updateData, { new: true });
        if (!data) {
            return res.status(404).json({ message: "Không tìm thấy thông báo" });
        }
        return res.json({
            message: "Cập nhật thông báo thành công",
            data
        });
    }
    catch (error) {
        (0, error_1.handleError)(res, error);
    }
});
exports.UpdateNotification = UpdateNotification;
const DeleteNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield notification_1.default.findByIdAndDelete(req.params.id);
        if (!data) {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                message: "Not found"
            });
        }
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            message: "Thành công",
        });
    }
    catch (error) {
        (0, error_1.handleError)(res, error);
    }
});
exports.DeleteNotification = DeleteNotification;
