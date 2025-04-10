import { Router } from "express";
import { getAllStudents } from "../controllers/student";

const StudentRouter = Router();
StudentRouter.post('/', getAllStudents);
export default StudentRouter