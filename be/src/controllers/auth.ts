import { handleError } from "../middlewares/error"
import { Request, Response, NextFunction } from 'express'
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
import StudentWallet from "../model/studentwallets";
interface DecodedToken {
    userId?: string;
    authId?: string;
    role?: string;
    iat?: number;
    exp?: number;
    user?: any;
    teacherId: string;
    studentId: string;
}
export interface CustomRequest extends Request {
    user?: DecodedToken;
}
export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, role, name, dob, major, gender, phone, address, major_id, StudentCode } = req.body;
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
                major_id,
                gender,
                phone,
                address,
                StudentCode,

            });
            await StudentWallet.create({
                student_id: user._id,
                balance: 0,
                transactions: []
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
            success: true,
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
                message: ["User không tồn tại"]
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
            const accessToken = await jwt.sign({ userId: user._id, role: user.role }, "dungnt", { expiresIn: "7d" });
            const refreshToken = await jwt.sign({ userId: user._id, role: user.role }, "dungnt", { expiresIn: "7d" });
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            })
            let userInfo = null;
            switch (user.role) {
                case 'student':
                    userInfo = await Student.findOne({ authId: user._id });
                    break;
                case 'teacher':
                    userInfo = await Teacher.findOne({ authId: user._id });
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
                    profile: userInfo,
                    accessToken: accessToken,
                    Status: StatusCodes.OK
                }
            })
        }
    } catch (error) {
        handleError(res, error)
    }
}
// refresh-token.ts
export const refreshToken = async (req: Request, res: Response) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) return res.status(401).json({ message: "No refresh token" });

        // verify refresh token
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET || "dungnt_refresh") as any;

        // check user exist
        const user = await Auth.findById(decoded.userId);
        if (!user) return res.status(401).json({ message: "User not found" });

        // tạo access token mới
        const newAccessToken = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET || "dungnt",
            { expiresIn: "15m" }
        );

        res.json({ accessToken: newAccessToken });
    } catch (err) {
        return res.status(401).json({ message: "Invalid refresh token" });
    }
};

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

export const authMiddleware = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }
  
    const token = authHeader.split(' ')[1];
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'xxx') as DecodedToken;
  
      // 1. Lấy auth
      const authDoc = await Auth.findById(decoded.userId);
      if (!authDoc) return res.status(401).json({ message: 'Auth not found' });
  
      let userDoc: any = null;
      let teacherId = null;
      let studentId = null;
  
      if (decoded.role === 'student') {
        userDoc = await Student.findOne({ authId: decoded.userId });
        if (!userDoc) return res.status(401).json({ message: 'Student not found' });
        studentId = userDoc._id;
      }
  
      if (decoded.role === 'teacher') {
        userDoc = await Teacher.findOne({ authId: decoded.userId });
        if (!userDoc) return res.status(401).json({ message: 'Teacher not found' });
        teacherId = userDoc._id;
      }
  
      if (decoded.role === 'admin') {
        userDoc = authDoc;
      }
  
      // 2. Gán req.user CHUẨN HỆ ID
      req.user = {
        userId: authDoc._id.toString(),   // ✅ Auth._id
        teacherId: teacherId?.toString(), // Teacher._id (nếu có)
        studentId: studentId?.toString(), // Student._id (nếu có)
        role: decoded.role,
      };
  
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Chưa đăng nhập' });
    }
  };
  