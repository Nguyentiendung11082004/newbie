import express, { NextFunction, Request, Response } from 'express'
import { CreateGrade, GetMyGrades, GetStudentListForGrading } from '../controllers/grade';
import { authMiddleware } from '../controllers/auth';

const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);
const GradeRoute = express.Router();

GradeRoute.post("/GetStudentListForGrading", asyncHandler(authMiddleware), asyncHandler(GetStudentListForGrading));
GradeRoute.post("/CreateGrade", asyncHandler(authMiddleware), asyncHandler(CreateGrade))
GradeRoute.post("/GetMyGrades", asyncHandler(authMiddleware), asyncHandler(GetMyGrades))
export default GradeRoute