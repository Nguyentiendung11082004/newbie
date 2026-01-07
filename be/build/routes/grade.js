"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const grade_1 = require("../controllers/grade");
const auth_1 = require("../controllers/auth");
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const GradeRoute = express_1.default.Router();
GradeRoute.post("/GetStudentListForGrading", asyncHandler(auth_1.authMiddleware), asyncHandler(grade_1.GetStudentListForGrading));
GradeRoute.post("/CreateGrade", asyncHandler(auth_1.authMiddleware), asyncHandler(grade_1.CreateGrade));
GradeRoute.post("/GetMyGrades", asyncHandler(auth_1.authMiddleware), asyncHandler(grade_1.GetMyGrades));
exports.default = GradeRoute;
