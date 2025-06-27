import express, { NextFunction, Request, Response } from 'express'
import { CreateGrade, GetMyGrades, getStudentListForGrading } from '../controllers/grade';
import { authMiddleware } from '../controllers/auth';

const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);
const GradeRoute = express.Router();

GradeRoute.post("/getStudentListForGrading", asyncHandler(authMiddleware), asyncHandler(getStudentListForGrading));
GradeRoute.post("/CreateGrade", asyncHandler(authMiddleware), asyncHandler(CreateGrade))
GradeRoute.post("/GetMyGrades", asyncHandler(authMiddleware), asyncHandler(GetMyGrades))
export default GradeRoute