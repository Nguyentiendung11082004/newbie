import { NextFunction, Request, Response, Router } from "express";
import { authMiddleware } from "../controllers/auth";
<<<<<<< HEAD
import { getTransactionHistory, getWalletById, makePayment, topUpWallter } from "../controllers/wallet";
=======
import { getAllTransactions, getTransactions, getWalletById, makePayment, payEnrollmentOnline, topUpIntent, topUpWallet } from "../controllers/wallet";
>>>>>>> 6c1e0219d5928377aebd76055f2ed5f81d10f102
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);
const StudentWalletRouter = Router();
StudentWalletRouter.post('/GetStudentWalletById', asyncHandler(authMiddleware), asyncHandler(getWalletById))
<<<<<<< HEAD
StudentWalletRouter.post('/TopUpWallter', asyncHandler(authMiddleware), asyncHandler(topUpWallter))
StudentWalletRouter.post('/MakePayment', asyncHandler(authMiddleware), asyncHandler(makePayment))
StudentWalletRouter.post('/GetTransactionHistory', asyncHandler(authMiddleware), asyncHandler(getTransactionHistory))
=======
StudentWalletRouter.post('/TopUpWallet', asyncHandler(authMiddleware), asyncHandler(topUpWallet))
StudentWalletRouter.post('/MakePayment', asyncHandler(authMiddleware), asyncHandler(makePayment))
StudentWalletRouter.post('/GetTransactions', asyncHandler(authMiddleware), asyncHandler(getTransactions))
StudentWalletRouter.post('/TopUpIntent', asyncHandler(authMiddleware), asyncHandler(topUpIntent))
StudentWalletRouter.post('/PayEnrollmentOnline', asyncHandler(authMiddleware), asyncHandler(payEnrollmentOnline))
StudentWalletRouter.get('/GetAllTransactions', asyncHandler(getAllTransactions))
// StudentWalletRouter.get('/GetDebtWallter', asyncHandler(authMiddleware), asyncHandler(getDebtWallter))
>>>>>>> 6c1e0219d5928377aebd76055f2ed5f81d10f102
export default StudentWalletRouter;