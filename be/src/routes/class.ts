import { Router } from "express";
import { createClass, deleteClass, getAllClass, getClassById, updateClass } from "../controllers/class";

const ClassRouter = Router();
ClassRouter.get('/', getAllClass);
ClassRouter.get('/:id', getClassById);
ClassRouter.post('/', createClass);
ClassRouter.put('/', updateClass);
ClassRouter.delete('/', deleteClass);
export default ClassRouter