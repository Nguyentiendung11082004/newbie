import { NextFunction, Request, Response, Router } from "express";
import { CreateTeachingAssignment, GetTeachingassment } from "../controllers/teachingassigment";
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);
const TeachingAssignmentRouter = Router();
TeachingAssignmentRouter.post('/', asyncHandler(CreateTeachingAssignment))
TeachingAssignmentRouter.get('/', asyncHandler(GetTeachingassment))
export default TeachingAssignmentRouter;