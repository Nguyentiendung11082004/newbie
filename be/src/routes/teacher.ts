import { NextFunction, Request, Response, Router } from "express";
import { GetClassesByTeacher, GetTeacherTimeTable, getAllTeacher } from "../controllers/teacher";
import { authMiddleware } from "../controllers/auth";
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);
const TeacherRouter = Router();
TeacherRouter.get('/', getAllTeacher)
TeacherRouter.post('/GetClassesByTeacher', asyncHandler(GetClassesByTeacher))
TeacherRouter.get('/GetTeacherTimeTable', asyncHandler(authMiddleware), asyncHandler(GetTeacherTimeTable))
export default TeacherRouter

