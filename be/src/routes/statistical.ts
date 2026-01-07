import express, { NextFunction, Request, Response } from "express";
import { AdminGetPayments, GetAdminSumary, GetEnrollmentBySemester, GetStudentByMajor } from "../controllers/statistical";
const StaticRoute = express.Router();

StaticRoute.get('/GetAdminSumary', GetAdminSumary);
StaticRoute.get('/GetEnrolmentBySemester', GetEnrollmentBySemester);
StaticRoute.get('/GetStudentByMajor', GetStudentByMajor);
StaticRoute.get('/AdminGetPayments', AdminGetPayments);
export default StaticRoute