import express, { NextFunction, Request, Response } from "express";
import { CreateNotification, DeleteNotification, GetNotification, UpdateNotification } from "../controllers/notification";
import { authMiddleware } from "../controllers/auth";
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);
const NotificationRouter = express.Router();
NotificationRouter.get('/GetNotification', asyncHandler(authMiddleware), asyncHandler(GetNotification));
NotificationRouter.post('/CreateNotification', asyncHandler(authMiddleware), asyncHandler(CreateNotification));
NotificationRouter.put('/UpdateNotification/:id', UpdateNotification);
NotificationRouter.delete('/DeleteNotification/:id', DeleteNotification);
export default NotificationRouter