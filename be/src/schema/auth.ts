import Joi from "joi";

export const StudentValidate = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.base": "Họ tên phải là chuỗi",
    "string.empty": "Họ tên là bắt buộc",
    "any.required": "Họ tên là bắt buộc",
  }),
  dob: Joi.date().required().messages({
    "date.base": "Ngày sinh không hợp lệ",
    "any.required": "Ngày sinh là bắt buộc",
  }),
  gender: Joi.string()
    .valid("Nam", "Nữ", "Khác")
    .required()
    .messages({
      "any.only": "Giới tính phải là Nam, Nữ hoặc Khác",
      "any.required": "Giới tính là bắt buộc",
    }),
  phone: Joi.string().required().messages({
    "string.base": "Số điện thoại phải là chuỗi",
    "any.required": "Số điện thoại là bắt buộc",
  }),
  address: Joi.string().required().messages({
    "string.base": "Địa chỉ phải là chuỗi",
    "any.required": "Địa chỉ là bắt buộc",
  }),
  role: Joi.string().valid('admin', 'student', 'teacher').required().messages({
    "any.only": "Role không hợp lệ",
    "any.required": "Role là bắt buộc",
  }),
  classId: Joi.array().items(Joi.string().hex().length(24)).messages({
    "string.hex": "ID lớp học không hợp lệ",
  }),
});

export const TeacherValidate = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Email không hợp lệ",
    "any.required": "Email là bắt buộc",
  }),
  full_name: Joi.string().trim().required().messages({
    "string.base": "Họ tên phải là chuỗi",
    "any.required": "Họ tên là bắt buộc",
    "string.empty": "Họ tên không được để trống",
  }),
  dob: Joi.date().required().messages({
    "date.base": "Ngày sinh không hợp lệ",
    "any.required": "Ngày sinh là bắt buộc",
  }),
  subject: Joi.string().trim().required().messages({
    "string.base": "Môn học phải là chuỗi",
    "any.required": "Môn học là bắt buộc",
    "string.empty": "Môn học không được để trống",
  }),
});
export const AuthValidate = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Email không hợp lệ",
    "any.required": "Email là bắt buộc",
    "string.empty": "Email không được để trống",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Mật khẩu phải có ít nhất 6 ký tự",
    "any.required": "Mật khẩu là bắt buộc",
    "string.empty": "Mật khẩu không được để trống",
  }),
  role: Joi.string().valid("admin", "student", "teacher").optional().messages({
    "any.only": "Role không hợp lệ",
  }),
});