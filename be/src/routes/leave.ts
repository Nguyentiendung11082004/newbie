import express, { NextFunction, Request, Response } from "express";
import { ApproveLeave, CreateLeave, GetAllLeave } from "../controllers/leaverequest"
import { authMiddleware } from "../controllers/auth";
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);
const LeaveRoute = express.Router();
LeaveRoute.post(`/GetAllLeave`, asyncHandler(GetAllLeave))
LeaveRoute.post(`/CreateLeave`, asyncHandler(authMiddleware), asyncHandler(CreateLeave))
LeaveRoute.post(`/ApproveLeave`, asyncHandler(authMiddleware), asyncHandler(ApproveLeave))
export default LeaveRoute;