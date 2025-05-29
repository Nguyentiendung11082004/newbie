import { Request } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
const uploadDir = path.join(__dirname, '../../public/UploadExcel');
// Tạo thư mục nếu chưa tồn tại
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
    destination: function (req: Request, file: any, cb) {
        cb(null, path.join(__dirname, '../../public/UploadExcel'));
    },
    filename: function (req: Request, file: any, cb) {
        cb(null, `excel-${Date.now()}${path.extname(file.originalname)}`);
    }
});

export const upload = multer({ storage });
