import { Request, Response } from "express"
import { handleError } from "../middlewares/error"
export const CreateTechingassment = async (req: Request, res: Response) => {
    try {

    } catch (error) {
        handleError(res, error)
    }
}