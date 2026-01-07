"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const attendance_1 = require("../controllers/attendance");
const auth_1 = require("../controllers/auth");
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const AttendanceRouter = express_1.default.Router();
AttendanceRouter.post('/CreateAttendance', asyncHandler(attendance_1.CreateAttendance));
AttendanceRouter.get('', asyncHandler(auth_1.authMiddleware), asyncHandler(attendance_1.getAttendanceHistory));
exports.default = AttendanceRouter;
