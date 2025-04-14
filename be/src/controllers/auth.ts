import { handleError } from "../middlewares/error"
import { Request, Response } from 'express'
import { AuthValidate } from "../schema/auth";
export const register = async (req: Request, res: Response) => {
    try {
        const { account, password } = req.body;
        const error = AuthValidate.validate(req.body, { abortEarly: false });    
        console.log("error",error)
    } catch (error) {
        handleError(res, error)
    }
}