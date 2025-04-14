"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = void 0;
const http_status_codes_1 = require("http-status-codes");
const handleError = (res, error) => {
    if (error instanceof Error) {
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
    return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: 'Đã có lỗi xảy ra' });
};
exports.handleError = handleError;
