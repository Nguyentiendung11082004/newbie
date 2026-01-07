import { NextFunction, Request, Response, Router } from "express";
import { login, logout, refreshToken, register } from "../controllers/auth";
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);
const AuthRouter = Router()
AuthRouter.post('/register', asyncHandler(register));
AuthRouter.post('/login', asyncHandler(login));
AuthRouter.post('/logout', asyncHandler(logout))
AuthRouter.post('/refreshToken', asyncHandler(refreshToken))
export default AuthRouter;