import Joi from 'joi';
export const EnrollmentValidate = Joi.object({
    subject_id: Joi.string().required().messages({
        "string.empty":"Môn học là bắt buộc"
    }),
    teacher_id: Joi.string().required().messages({
        "string.empty":"Giáo viên là bắt buộc"
    })
})