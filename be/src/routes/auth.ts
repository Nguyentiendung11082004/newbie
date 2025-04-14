import { Router } from "express";
import { register } from "../controllers/auth";

const AuthRouter = Router()
AuthRouter.post('/register', register);

export default AuthRouter;