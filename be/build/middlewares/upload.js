"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const uploadDir = path_1.default.join(__dirname, '../../public/UploadExcel');
// Tạo thư mục nếu chưa tồn tại
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path_1.default.join(__dirname, '../../public/UploadExcel'));
    },
    filename: function (req, file, cb) {
        cb(null, `excel-${Date.now()}${path_1.default.extname(file.originalname)}`);
    }
});
exports.upload = (0, multer_1.default)({ storage });
