"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subject_1 = require("../controllers/subject");
const SubjectRouter = (0, express_1.Router)();
SubjectRouter.get('/', subject_1.getAllSubject);
SubjectRouter.get('/all', subject_1.getAllSubjects);
SubjectRouter.post('/', subject_1.createSubject);
exports.default = SubjectRouter;
