"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notification_1 = require("../controllers/notification");
const auth_1 = require("../controllers/auth");
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const NotificationRouter = express_1.default.Router();
NotificationRouter.get('/GetNotification', asyncHandler(auth_1.authMiddleware), asyncHandler(notification_1.GetNotification));
NotificationRouter.post('/CreateNotification', asyncHandler(auth_1.authMiddleware), asyncHandler(notification_1.CreateNotification));
NotificationRouter.put('/UpdateNotification', notification_1.UpdateNotification);
NotificationRouter.delete('/DeleteNotification/:id', notification_1.DeleteNotification);
NotificationRouter.get('/GetNotificationById/:id', notification_1.GetNotificationById);
exports.default = NotificationRouter;
