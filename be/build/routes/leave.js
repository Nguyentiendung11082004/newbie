"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const leaverequest_1 = require("../controllers/leaverequest");
const auth_1 = require("../controllers/auth");
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const LeaveRoute = express_1.default.Router();
LeaveRoute.post(`/GetAllLeave`, asyncHandler(leaverequest_1.GetAllLeave));
LeaveRoute.post(`/CreateLeave`, asyncHandler(auth_1.authMiddleware), asyncHandler(leaverequest_1.CreateLeave));
LeaveRoute.post(`/ApproveLeave`, asyncHandler(auth_1.authMiddleware), asyncHandler(leaverequest_1.ApproveLeave));
exports.default = LeaveRoute;
