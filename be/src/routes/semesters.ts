import express from "express";
import { GetAllSemesters } from "../controllers/semesters";

const SemestersRouter = express.Router();
SemestersRouter.get('/GetSemesters', GetAllSemesters);
export default SemestersRouter
