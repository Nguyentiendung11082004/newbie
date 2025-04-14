"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = routes;
const students_1 = __importDefault(require("./students"));
const class_1 = __importDefault(require("./class"));
const auth_1 = __importDefault(require("./auth"));
function routes(app) {
    app.use('/api/v1/students', students_1.default);
    app.use('/api/v1/class', class_1.default);
    app.use('/api/v1/auth', auth_1.default);
}
