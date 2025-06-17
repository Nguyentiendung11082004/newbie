import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import { ConnectDataBase } from "./config/dbconfig";
import routes from "./routes";
import { swaggerSpec, swaggerUi } from "./config/swagger";

// Khởi tạo app
const app = express();
dotenv.config();

// Middleware để parse data từ client
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
  origin: (origin, callback) => {
    callback(null, true); // chấp nhận tất cả origin
  },
  credentials: true,
}));
app.use(morgan("tiny"));
app.use('/TempFile', express.static('public/TempFile'));
// Kết nối database
const isDev = process.env.NODE_ENV === 'development';
const uri = isDev ? process.env.MONGO_URI : process.env.DB_URI;
ConnectDataBase(uri || '');
// Router
routes(app);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
// Khởi chạy server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
