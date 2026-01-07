"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const statistical_1 = require("../controllers/statistical");
const StaticRoute = express_1.default.Router();
StaticRoute.get('/GetAdminSumary', statistical_1.GetAdminSumary);
StaticRoute.get('/GetEnrolmentBySemester', statistical_1.GetEnrollmentBySemester);
StaticRoute.get('/GetStudentByMajor', statistical_1.GetStudentByMajor);
StaticRoute.get('/AdminGetPayments', statistical_1.AdminGetPayments);
exports.default = StaticRoute;
