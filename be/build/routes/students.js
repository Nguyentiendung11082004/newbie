"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const student_1 = require("../controllers/student");
const StudentRouter = (0, express_1.Router)();
StudentRouter.post('/', student_1.getAllStudents);
exports.default = StudentRouter;
