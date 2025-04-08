import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import { ConnectDataBase } from "./config/dbconfig";
import routes from "./routes";

// Khởi tạo app
const app = express();
dotenv.config();

// Middleware để parse data từ client
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));

// Kết nối database
ConnectDataBase("mongodb://localhost:27017/students_management");

// Router
routes(app);

// Khởi chạy server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
