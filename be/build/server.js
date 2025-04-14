"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const dbconfig_1 = require("./config/dbconfig");
const routes_1 = __importDefault(require("./routes"));
// Khởi tạo app
const app = (0, express_1.default)();
dotenv_1.default.config();
// Middleware để parse data từ client
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use((0, morgan_1.default)("tiny"));
// Kết nối database
(0, dbconfig_1.ConnectDataBase)(process.env.MONGO_URI || '');
// Router
(0, routes_1.default)(app);
// Khởi chạy server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
