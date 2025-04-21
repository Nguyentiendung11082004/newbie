import { Router } from "express";
import { getAllTeacher } from "../controllers/teacher";
const TeacherRouter = Router();
TeacherRouter.get('/', getAllTeacher)
export default TeacherRouter

