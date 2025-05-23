import express, { NextFunction, Request, Response } from "express";
import { CreateAttendance, getAttendanceHistory } from "../controllers/attendance";
import { authMiddleware } from "../controllers/auth";
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);
const AttendanceRouter = express.Router();
AttendanceRouter.post('/CreateAttendance', asyncHandler(CreateAttendance));
AttendanceRouter.get('', asyncHandler(authMiddleware), asyncHandler(getAttendanceHistory))

export default AttendanceRouter