import { Router } from "express";
import { createMajor, deleteMajor, getAllMajor, getMajorById, updateMajor } from "../controllers/major";

const MajorRouter = Router();
MajorRouter.get('/GetAllMajor', getAllMajor);
MajorRouter.get('/:id', getMajorById);
MajorRouter.post('/', createMajor);
MajorRouter.put('/', updateMajor);
MajorRouter.delete('/', deleteMajor);
export default MajorRouter