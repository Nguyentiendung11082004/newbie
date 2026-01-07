"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../controllers/auth");
const wallet_1 = require("../controllers/wallet");
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const StudentWalletRouter = (0, express_1.Router)();
StudentWalletRouter.post('/GetStudentWalletById', asyncHandler(auth_1.authMiddleware), asyncHandler(wallet_1.getWalletById));
StudentWalletRouter.post('/TopUpWallet', asyncHandler(auth_1.authMiddleware), asyncHandler(wallet_1.topUpWallet));
StudentWalletRouter.post('/MakePayment', asyncHandler(auth_1.authMiddleware), asyncHandler(wallet_1.makePayment));
StudentWalletRouter.post('/GetTransactions', asyncHandler(auth_1.authMiddleware), asyncHandler(wallet_1.getTransactions));
StudentWalletRouter.post('/TopUpIntent', asyncHandler(auth_1.authMiddleware), asyncHandler(wallet_1.topUpIntent));
StudentWalletRouter.post('/PayEnrollmentOnline', asyncHandler(auth_1.authMiddleware), asyncHandler(wallet_1.payEnrollmentOnline));
StudentWalletRouter.get('/GetAllTransactions', asyncHandler(wallet_1.getAllTransactions));
// StudentWalletRouter.get('/GetDebtWallter', asyncHandler(authMiddleware), asyncHandler(getDebtWallter))
exports.default = StudentWalletRouter;
