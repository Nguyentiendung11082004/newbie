<<<<<<< HEAD
import express, { Router } from "express";
import { CreateNotification, DeleteNotification, GetAllNotification, UpdateNotification } from "../controllers/notification";

const NotificationRouter = express.Router();
NotificationRouter.get('/GetAllNotification', GetAllNotification);
NotificationRouter.post('/CreateNotification', CreateNotification);
NotificationRouter.put('/UpdateNotification/:id', UpdateNotification);
NotificationRouter.delete('/DeleteNotification/:id', DeleteNotification);
=======
import express, { NextFunction, Request, Response } from "express";
import { CreateNotification, DeleteNotification, GetNotification, GetNotificationById, UpdateNotification } from "../controllers/notification";
import { authMiddleware } from "../controllers/auth";
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);
const NotificationRouter = express.Router();
NotificationRouter.get('/GetNotification', asyncHandler(authMiddleware), asyncHandler(GetNotification));
NotificationRouter.post('/CreateNotification', asyncHandler(authMiddleware), asyncHandler(CreateNotification));
NotificationRouter.put('/UpdateNotification', UpdateNotification);
NotificationRouter.delete('/DeleteNotification/:id', DeleteNotification);
NotificationRouter.get('/GetNotificationById/:id', GetNotificationById);

>>>>>>> 6c1e0219d5928377aebd76055f2ed5f81d10f102
export default NotificationRouter