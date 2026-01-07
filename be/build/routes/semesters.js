"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const semesters_1 = require("../controllers/semesters");
const SemestersRouter = express_1.default.Router();
SemestersRouter.get('/GetSemesters', semesters_1.GetAllSemesters);
exports.default = SemestersRouter;
