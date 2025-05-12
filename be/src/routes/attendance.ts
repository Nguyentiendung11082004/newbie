import express, { NextFunction, Request, Response } from "express";
import { CreateAttendance } from "../controllers/attendance";
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);
const AttendanceRouter = express.Router();
AttendanceRouter.post('/CreateAttendance', asyncHandler(CreateAttendance));
export default AttendanceRouter