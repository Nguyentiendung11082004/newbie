"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../controllers/auth");
const AuthRouter = (0, express_1.Router)();
AuthRouter.post('/register', auth_1.register);
exports.default = AuthRouter;
