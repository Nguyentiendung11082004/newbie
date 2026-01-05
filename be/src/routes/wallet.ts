import { NextFunction, Request, Response, Router } from "express";
import { authMiddleware } from "../controllers/auth";
import { getTransactions, getWalletById, makePayment, payEnrollmentOnline, topUpIntent, topUpWallet } from "../controllers/wallet";
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);
const StudentWalletRouter = Router();
StudentWalletRouter.post('/GetStudentWalletById', asyncHandler(authMiddleware), asyncHandler(getWalletById))
StudentWalletRouter.post('/TopUpWallet', asyncHandler(authMiddleware), asyncHandler(topUpWallet))
StudentWalletRouter.post('/MakePayment', asyncHandler(authMiddleware), asyncHandler(makePayment))
StudentWalletRouter.post('/GetTransactionHistory', asyncHandler(authMiddleware), asyncHandler(getTransactions))
StudentWalletRouter.post('/TopUpIntent', asyncHandler(authMiddleware), asyncHandler(topUpIntent))
StudentWalletRouter.post('/PayEnrollmentOnline', asyncHandler(authMiddleware), asyncHandler(payEnrollmentOnline))
// StudentWalletRouter.get('/GetDebtWallter', asyncHandler(authMiddleware), asyncHandler(getDebtWallter))
export default StudentWalletRouter;