import { NextFunction, Request, Response, Router } from "express";
import { CreateTeachingAssignment, DeleteTeachingAssignment, GetTeachigngassmentById, GetTeachingassment, UpdateTeachingAssignment } from "../controllers/teachingassigment";
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);
const TeachingAssignmentRouter = Router();
TeachingAssignmentRouter.post('/', asyncHandler(CreateTeachingAssignment))
TeachingAssignmentRouter.get('/GetAllTeachingassignment', asyncHandler(GetTeachingassment))
TeachingAssignmentRouter.get('/:id', asyncHandler(GetTeachigngassmentById))
TeachingAssignmentRouter.put('/:id', asyncHandler(UpdateTeachingAssignment))
TeachingAssignmentRouter.delete('/:id', asyncHandler(DeleteTeachingAssignment))
export default TeachingAssignmentRouter;