import { Router } from "express";
import { ExportExcel, ImportExcel, getAllStudents } from "../controllers/student";
import { upload } from "../middlewares/upload";

const StudentRouter = Router();
StudentRouter.post('/', getAllStudents);
StudentRouter.get('/export-student', ExportExcel)
StudentRouter.post('/import-student', upload.single('file'), ImportExcel)
export default StudentRouter