"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = exports.swaggerUi = void 0;
const path_1 = __importDefault(require("path"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
exports.swaggerUi = swagger_ui_express_1.default;
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Student Manager API',
            version: '1.0.0',
            description: 'Tài liệu API hệ thống quản lý sinh viên',
        },
        servers: [
            {
                //   url: 'https://api-studentmanager.onrender.com',   api khi deploy
                url: 'http://localhost:8080/api/v1/'
            },
        ],
    },
    apis: [path_1.default.join(__dirname, '../routes/**/*.ts')],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
exports.swaggerSpec = swaggerSpec;
