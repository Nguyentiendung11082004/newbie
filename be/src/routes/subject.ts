import { Router } from "express";
import { createSubject, getAllSubject, getAllSubjects } from "../controllers/subject";

const SubjectRouter = Router();
SubjectRouter.get('/', getAllSubject)
SubjectRouter.get('/all', getAllSubjects)
SubjectRouter.post('/', createSubject)
export default SubjectRouter