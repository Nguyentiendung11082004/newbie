import { handleError } from "../middlewares/error"
import { Request, Response } from 'express'
import { StatusCodes } from "http-status-codes";
import AuthSchema from "../model/auth"
import StudentSchema from "../model/student"
import TeacherSchema from "../model/teacher"
import BlacklistedToken from "../model/black-lited-token"
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken"
import { AuthValidate, StudentValidate, TeacherValidate } from "../schema/auth";

import Student from "../model/student";
import Teacher from "../model/teacher";
import Auth from "../model/auth";
export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, role, name, subject, dob, major, gender, phone, address } = req.body;
        let result;
        switch (role) {
            case 'student':
                result = StudentValidate.validate(req.body, { abortEarly: false, allowUnknown: true });
                break;
            case 'teacher':
                result = TeacherValidate.validate(req.body, { abortEarly: false, allowUnknown: true });
                break;
            default:
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: "Role không hợp lệ",
                });
        }

        if (result.error?.details) {
            const messages = result.error.details.reduce((acc: any, err: any) => {
                acc[err.path[0]] = err.message;
                return acc;
            }, {});
            return res.status(StatusCodes.BAD_REQUEST).json({ messages });
        }
        if (!email) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Email không được để trống"
            });
        }

        const exitUser = await AuthSchema.findOne({ email });
        if (exitUser) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Email đã tồn tại",
            });
        }

        // Mã hóa mật khẩu
        const hassPass = await bcryptjs.hash(password, 10);
        console.log("REQ BODY:", req.body);
        // Tạo bản ghi trong bảng auths
        const auth = await AuthSchema.create({
            email,
            password: hassPass,
            role,
        });
        let user;
        // Tạo bản ghi trong bảng students nếu là sinh viên
        if (role === 'student') {
            user = await StudentSchema.create({
                authId: auth._id,
                email: email,
                name,
                dob,
                major,
                gender,
                phone,
                address,
            });
        } else if (role === 'teacher') {
            user = await TeacherSchema.create({
                authId: auth._id,
                email: email,
                name,
                dob,
                major,
                gender,
                phone,
                address,
            });
        }

        res.status(StatusCodes.OK).json({
            message: "Đăng ký thành công",
            data: user,
        });
    } catch (error) {
        handleError(res, error);
    }
};
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const result = AuthValidate.validate(req.body, { abortEarly: false });
        if (result.error?.details) {
            const message = result.error?.details.map((e) => e.message)
            res.status(StatusCodes.BAD_REQUEST).json({
                message,
                Status: StatusCodes.BAD_REQUEST
            })
        }
        const user = await AuthSchema.findOne({ email });
        if (!user) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: ["user không tồn tại"]
            })
        }
        if (user) {
            const isPass = await bcryptjs.compare(password, user.password);
            if (!isPass) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    message: ['Sai mật khẩu']
                })
            }
            user.password = undefined as unknown as string;
            const token = await jwt.sign({ userId: user._id, role: user.role }, "xxx", { expiresIn: "1h" });
            let userInfo = null;
            switch (user.role) {
                case 'student':
                    userInfo = await Student.findOne({ authId: user._id }).select('_id name classId');
                    break;
                case 'teacher':
                    userInfo = await Teacher.findOne({ authId: user._id }).select('_id name');
                    break;
                case 'admin':
                    userInfo = await Auth.findOne({ authId: user._id });
                    break;
                default:
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        message: "Role không hợp lệ",
                    });
            }
            res.status(StatusCodes.OK).json({
                data: {
                    message: "Đăng nhập thành công",
                    user,
                    student: userInfo,
                    token,
                    Status: StatusCodes.OK
                }
            })
        }
    } catch (error) {
        handleError(res, error)
    }
}
export const logout = async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid token format" });
        }
        const token = authHeader.split(" ")[1];
        const isBlacklisted = await BlacklistedToken.findOne({ token });
        if (isBlacklisted) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: "Token already logged out" });
        }
        await new BlacklistedToken({ token }).save();
        res.status(StatusCodes.OK).json({
            data: {
                message: "Đăng xuất thành công",
                StatusCodes: StatusCodes.OK
            }
        });
    } catch (error) {
        console.error(`Error during logout:`, error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
    }
};
