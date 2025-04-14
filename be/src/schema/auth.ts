import Joi from "joi";
export const AuthValidate = Joi.object({
    account: Joi.string().required().trim().messages({
        "any.required": "Tên tài khoản là bắt buộc",
    }),
    password: Joi.string().min(6).max(20).required().messages({
        "any.required": "Mật khẩu là bắt buộc",
        "string.min": "Password phai co it nhat {#limit} ky tu ",
        "string.max": "Password phai it hon {#limit} ky tu",
    })
})