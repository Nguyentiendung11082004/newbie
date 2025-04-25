import express, { NextFunction, Request, Response } from "express";
import { CreateEnrollSubject, DeleteEnroll, getAllEnrollSubject, getEnrollSubject, getTeachingAssignmentsForEnroll, updateEnrollSubject } from "../controllers/enrollment";

const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

const EnrollmentRouter = express.Router();
EnrollmentRouter.post("/CreateEnrollment", asyncHandler(CreateEnrollSubject));
EnrollmentRouter.get("/GetAllEnrollment", asyncHandler(getAllEnrollSubject));
EnrollmentRouter.post("/GetByIdEnrollment", asyncHandler(getEnrollSubject));
EnrollmentRouter.post("/GetTeachingAssignmentsForEnroll", asyncHandler(getTeachingAssignmentsForEnroll));
EnrollmentRouter.delete("/DeleteEnroll/:id", asyncHandler(DeleteEnroll));
EnrollmentRouter.put("/UpdateEnrollment/:id", asyncHandler(updateEnrollSubject))
export default EnrollmentRouter;
