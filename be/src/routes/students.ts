import { Router } from "express";
import { ExportExcel, ImportExcel, getAllStudents } from "../controllers/student";
import { upload } from "../middlewares/upload";

const StudentRouter = Router();
/**
 * @openapi
 * /students:
 *   post:
 *     summary: Lấy danh sách sinh viên 
 *     tags:
 *       - Students
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               _page:
 *                 type: integer
 *                 example: 1
 *               _limit:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       200:
 *         description: Thành công
 */
StudentRouter.post('/', getAllStudents);
/**
 * @openapi
 * /students/export-student:
 *   get:
 *     summary: Xuất danh sách sinh viên ra Excel
 *     tags:
 *       - Students
 *     responses:
 *       200:
 *         description: Trả về file Excel
 */
StudentRouter.get('/export-student', ExportExcel)
/**
 * @openapi
 * /students/import-student:
 *   post:
 *     summary: Import danh sách sinh viên từ Excel
 *     tags:
 *       - Students
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Import thành công
 */
StudentRouter.post('/import-student', upload.single('file'), ImportExcel)
export default StudentRouter

