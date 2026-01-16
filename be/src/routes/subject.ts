import { Router } from "express";
import { createSubject, deleteSubject, getAllSubject, getAllSubjects, getSubjectById, updateSubject } from "../controllers/subject";

const SubjectRouter = Router();
SubjectRouter.get('/', getAllSubject)
SubjectRouter.get('/all', getAllSubjects)
SubjectRouter.post('/', createSubject)
SubjectRouter.get('/GetSubject/:id', getSubjectById)
SubjectRouter.put('/UpdateSubject/:id', updateSubject)
SubjectRouter.delete('/DeleteSubject/:id', deleteSubject)
export default SubjectRouter