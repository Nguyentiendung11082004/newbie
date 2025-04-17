import { handleError } from "../middlewares/error"
import { Request, Response } from 'express'
import { StatusCodes } from "http-status-codes";
import AuthSchema from "../model/auth"
import StudentSchema from "../model/student"
import TeacherSchema from "../model/teacher"
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken"
import { AuthValidate, StudentValidate, TeacherValidate } from "../schema/auth";
import Student from "../model/student";
// Mã đăng ký tài khoản
export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, role, name, subject, dob, major, gender, phone, address } = req.body;
        let result;
        // Xác thực dữ liệu đầu vào
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
                authId: auth._id,  // Liên kết với bảng auths
                email: email,  // Nếu bạn muốn lưu email trong bảng students
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
            let studentInfo = null;
            if (user.role === 'student') {
                studentInfo = await Student.findOne({ authId: user._id }).select('_id name classId');
            }
            res.status(StatusCodes.OK).json({
                data: {
                    message: "Đăng nhập thành công",
                    user,
                    student: studentInfo,
                    token,
                    Status: StatusCodes.OK
                }
            })
        }
    } catch (error) {
        handleError(res, error)
    }
}