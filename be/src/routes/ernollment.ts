import express, { Request, Response, NextFunction } from "express";
import { EnrollSubject, getAllEnrollSubject, getEnrollSubject } from "../controllers/enrollment";

const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

const EnrollmentRouter = express.Router();
EnrollmentRouter.post("/", asyncHandler(EnrollSubject));
EnrollmentRouter.get("/", asyncHandler(getAllEnrollSubject));
EnrollmentRouter.post("/enrollment", asyncHandler(getEnrollSubject));


export default EnrollmentRouter;
