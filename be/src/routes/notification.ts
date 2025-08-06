import express, { Router } from "express";
import { CreateNotification, DeleteNotification, GetAllNotification, UpdateNotification } from "../controllers/notification";

const NotificationRouter = express.Router();
NotificationRouter.get('/GetAllNotification', GetAllNotification);
NotificationRouter.post('/CreateNotification', CreateNotification);
NotificationRouter.put('/UpdateNotification/:id', UpdateNotification);
NotificationRouter.delete('/DeleteNotification/:id', DeleteNotification);
export default NotificationRouter