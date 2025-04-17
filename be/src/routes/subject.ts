import { Router } from "express";
import { getAllSubject } from "../controllers/subject";

const SubjectRouter = Router();
SubjectRouter.get('/', getAllSubject)
export default SubjectRouter