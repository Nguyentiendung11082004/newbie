import { NextFunction, Request, Response, Router } from "express";
import { authMiddleware } from "../controllers/auth";
import { getDebtWallter, getTransactionHistory, getWalletById, makePayment, topUpWallter } from "../controllers/wallet";
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);
const StudentWalletRouter = Router();
StudentWalletRouter.post('/GetStudentWalletById', asyncHandler(authMiddleware), asyncHandler(getWalletById))
StudentWalletRouter.post('/TopUpWallter', asyncHandler(authMiddleware), asyncHandler(topUpWallter))
StudentWalletRouter.post('/MakePayment', asyncHandler(authMiddleware), asyncHandler(makePayment))
StudentWalletRouter.post('/GetTransactionHistory', asyncHandler(authMiddleware), asyncHandler(getTransactionHistory))
StudentWalletRouter.get('/GetDebtWallter', asyncHandler(authMiddleware), asyncHandler(getDebtWallter))
export default StudentWalletRouter;