import { NextFunction, Request, Response, Router } from "express";
import { GetClassesByTeacher, getAllTeacher } from "../controllers/teacher";
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);
const TeacherRouter = Router();
TeacherRouter.get('/', getAllTeacher)
TeacherRouter.post('/GetClassesByTeacher', asyncHandler(GetClassesByTeacher))
export default TeacherRouter

