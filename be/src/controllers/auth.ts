import { handleError } from "../middlewares/error"
import { Request, Response } from 'express'
import { AuthValidate } from "../schema/auth";
import { StatusCodes } from "http-status-codes";
import AuthSchema from "../model/auth"
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken"
export const register = async (req: Request, res: Response) => {
    try {
        const { account, password } = req.body;
        const result = AuthValidate.validate(req.body, { abortEarly: false });
        if (result.error?.details) {
            const messages = result.error.details.map((err) => err.message);
            res.status(StatusCodes.BAD_REQUEST).json({
                messages: messages
            })
        }
        // ktra xem ton tai user chua
        const exitUser = await AuthSchema.findOne({ account })
        if (exitUser) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: "Tên đăng nhập đã tồn tại"
            })
        }
        // ma hoa pass
        const hassPass = await bcryptjs.hash(password, 10);
        // luu vao db
        const user = await AuthSchema.create({
            account,
            password: hassPass
        });
        // an pass
        user.password = undefined as unknown as string;
        // tra ra fe
        res.status(StatusCodes.OK).json({
            message: "Đăng ký thành công",
            data: user
        })
    } catch (error) {
        handleError(res, error)
    }
}
export const login = async (req: Request, res: Response) => {
    try {
        const { account, password } = req.body;
        const result = AuthValidate.validate(req.body, { abortEarly: false });
        if (result.error?.details) {
            const message = result.error?.details.map((e) => e.message)
            res.status(StatusCodes.BAD_REQUEST).json({
                message,
            })
        }
        const user = await AuthSchema.findOne({ account });
        if (!user) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: "user không tồn tại"
            })
        }
        if (user) {
            const isPass = await bcryptjs.compare(password, user.password);
            if (!isPass) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    message: 'Sai mật khẩu'
                })
            }
            user.password = undefined as unknown as string;
            const token = await jwt.sign({ userId: user._id }, "xxx", { expiresIn: "1h" });
            res.status(StatusCodes.OK).json({
                message: "Đăng nhập thành coong",
                user,
                token
            })
        }
    } catch (error) {
        handleError(res, error)
    }
}