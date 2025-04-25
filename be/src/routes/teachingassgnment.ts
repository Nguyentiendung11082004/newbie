import { NextFunction, Request, Response, Router } from "express";
import { CreateTeachingAssignment, DeleteTeachingAssignment, GetTeachigngassmentById, GetTeachingassment, UpdateTeachingAssignment } from "../controllers/teachingassigment";
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);
const TeachingAssignmentRouter = Router();
TeachingAssignmentRouter.post('/CreateTeachingassignment', asyncHandler(CreateTeachingAssignment))
TeachingAssignmentRouter.get('/GetAllTeachingassignment', asyncHandler(GetTeachingassment))
TeachingAssignmentRouter.get('/GetByIdTeachingassignment', asyncHandler(GetTeachigngassmentById));
TeachingAssignmentRouter.put('/UpdateTeachingassignment', asyncHandler(UpdateTeachingAssignment))
TeachingAssignmentRouter.delete('/DeleteTeachingassignment/:id', asyncHandler(DeleteTeachingAssignment))
export default TeachingAssignmentRouter;