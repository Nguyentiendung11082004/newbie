import Joi from "joi";

export const AuthValidate = Joi.object({
  account: Joi.string()
    .trim()
    .required()
    .messages({
      "string.base": "Tên tài khoản phải là chuỗi",
      "any.required": "Tên tài khoản là bắt buộc",
      "string.empty": "Tên tài khoản không được để trống",
    }),

  password: Joi.string()
    .min(6)
    .max(20)
    .required()
    .messages({
      "string.base": "Mật khẩu phải là chuỗi",
      "any.required": "Mật khẩu là bắt buộc",
      "string.empty": "Mật khẩu không được để trống",
      "string.min": "Mật khẩu phải có ít nhất {#limit} ký tự",
      "string.max": "Mật khẩu phải ít hơn {#limit} ký tự",
    }),
});
