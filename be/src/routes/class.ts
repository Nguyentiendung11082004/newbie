import { Router } from "express";
import { createClass, deleteClass, getAllClass, getClassById, updateClass } from "../controllers/class";

const ClassRouter = Router();
ClassRouter.get('/', getAllClass);
ClassRouter.get('/:id', getClassById);
ClassRouter.post('/createClass', createClass);
ClassRouter.put('/UpdateClass/:id', updateClass);
ClassRouter.delete('/DeleteClass/:id', deleteClass);
export default ClassRouter