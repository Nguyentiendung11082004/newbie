import { Request, Response } from "express"
import Student from "../model/student"
import { StatusCodes } from "http-status-codes";
import { handleError } from "../middlewares/error";
import * as XLSX from 'xlsx';
import path from "path";
import Enrollment from "../model/enrollment";
import { getDayOfWeekFromDate } from "../middlewares/utils";
import { listeners } from "process";
interface Customer extends Request {
    user: {
        _id: string;
        role: string;
        email: string;
        userId: string;
    };
}
export const getAllStudents = async (req: Request, res: Response) => {
    try {
        const {
            _page = 1,
            _limit = 10,
            _sort = "createdAt",
            _order = "asc",
            Keyword = ""
        } = req.body;
        const query: any = {};
        if (Keyword) {
            const regex = { $regex: Keyword, $options: 'i' };
            query.$or = [
                { name: regex },
                { email: regex },
                { className: regex },
                { major: regex }
            ];
        }
        const options = {
            page: parseInt(_page),
            limit: parseInt(_limit),
            sort: { [_sort]: _order === 'asc' ? 1 : -1 }
        };
        const students = await Student.paginate(query, options);
        res.status(StatusCodes.OK).json({
            message: 'Thành công',
            data: students.docs,
            pagination: {
                totalDocs: students.totalDocs,
                totalPages: students.totalPages,
                page: students.page,
                limit: students.limit
            }
        })
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({ message: 'Đã có lỗi xảy ra' });
        }
    }
}
export const ExportExcel = async (req: Request, res: Response) => {
    try {
        const students = await Student.find().lean();
        const jsonData = students.map(({ _id, authId, classId, ...rest }) => rest)
        const woorksheet = XLSX.utils.json_to_sheet(jsonData)
        const worksbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(worksbook, woorksheet, 'Student');

        // Tạo file path
        const fileName = `students-${Date.now()}.xlsx`;
        const filePath = path.join(__dirname, '../../public/TempFile', fileName);

        // Ghi file ra ổ đĩa
        XLSX.writeFile(worksbook, filePath);
        res.setHeader('Content-Disposition', 'attachment; filename="students.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        // Trả URL cho client (frontend dùng window.open())
        res.status(StatusCodes.OK).json({
            data: {
                message: 'Thành công',
                Url: `/TempFile/${fileName}`
            }
        });
    } catch (error) {
        handleError(res, error)
    }
}

export const ImportExcel = async (req: Request, res: Response) => {
    try {
        const file = req.file;
        if (file) {
            const workBook = XLSX.readFile(file.path);
            const sheetName = workBook.SheetNames[0];
            const worksheet = workBook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            const data = await Student.create(jsonData)
            res.status(StatusCodes.OK).json({
                data: {
                    message: 'Thành công',
                    data: data
                }
            })
        }
    } catch (error) {
        handleError(res, error)
    }
}


export const GetStudentTimeTable = async (req: Customer, res: Response) => {
    try {
        const studentId = req.user.userId;
        const { fromDate, toDate, subjects, classes, rooms } = req.body;
        const enrollments = await Enrollment.find({
            student_id: studentId,
            status: 'Approved'
        }).populate({
            path: 'teaching_assignment_id',
            populate: [
                { path: 'subject_id', select: 'name' },
                { path: 'class_id', select: 'ClassName' }
            ]
        });
        let timetable = enrollments.flatMap((enroll: any) => {
            const ta = enroll.teaching_assignment_id;
            return ta.schedule.map((schedule: any) => {
                const dayOfWeek = getDayOfWeekFromDate(schedule.date);
                return {
                    subject: ta.subject_id.name,
                    class: ta.class_id.ClassName,
                    date: schedule.date,
                    dayOfWeek: dayOfWeek,
                    startTime: schedule.startTime,
                    endTime: schedule.endTime
                }
            });
        });
        if (fromDate && toDate) {
            timetable = timetable.filter(item =>
                item.date >= fromDate && toDate <= toDate
            )
        }
        if (subjects?.length) {
            timetable = timetable.filter(item =>
                subjects.includes(item.subject)
            )
        }
        if (classes?.length) {
            timetable = timetable.filter(item =>
                classes.includes(item.class)
            )
        }
        if (rooms?.length) {
            timetable = timetable.filter(item =>
                rooms.includes(item.room)
            )
        }
        return res.status(StatusCodes.OK).json({
            message: "Thành công",
            data: timetable,
        })
    } catch (error) {
        handleError(res, error)
    }
}
export const GetAllCardRequest = async (req: Customer, res: Response) => {
    try {
        const { status } = req.query;
        const filter: any = {};

        if (status) {
            filter['cardRequest.status'] = status;
        } else {
            filter['cardRequest.status'] = { $exists: true };
        }

        const data = await Student.find(filter)
            .select('name StudentCode cardRequest')
            .populate('classId', 'name')
            .sort({ 'cardRequest.createdAt': -1 });

        return res.status(200).json({
            message: 'Lấy danh sách yêu cầu thành công',
            data,
        });
    } catch (error) {
        handleError(res, error);
    }
};

export const CreateCardRequest = async (req: Customer, res: Response) => {
    try {
        const studentId = req.user.userId;
        const { reason, photoUrl } = req.body;
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "Sinh viên không tồn tại",
            });
        }
        if (
            student.cardRequest &&
            student.cardRequest.status === "Pending"
        ) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Đã gửi yêu cầu trước đó, vui lòng chờ xử lý.",
            });
        }
        student.cardRequest = {
            reason,
            photoUrl,
            requestedAt: new Date(),
            status: "Pending",
        };
        await student.save();
        return res.status(StatusCodes.OK).json({
            message: "Đã gửi yêu cầu cấp lại thẻ.",
        });
    } catch (error) {
        handleError(res, error);
    }
};
export const UpdateCardRequest = async (req: Request, res: Response) => {
    try {
        const { studentId, status, adminNote } = req.body;
        if (!['Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
        }
        const student = await Student.findById(studentId);
        if (!student || !student.cardRequest) {
            return res.status(404).json({ message: 'Không tìm thấy yêu cầu cấp thẻ' });
        }
        student.cardRequest.status = status;
        student.cardRequest.adminNote = adminNote;
        student.cardRequest.processedAt = new Date();
        await student.save();
        return res.status(200).json({ message: 'Cập nhật thành công' });
    } catch (error) {
        handleError(res, error);
    }
}
export const GetMyCardRequest = async (req: Customer, res: Response) => {
    try {
        const studentId = req.user.userId;
        const student = await Student.findById(studentId);

        if (!student || !student.cardRequest) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "Không tìm thấy yêu cầu cấp lại thẻ.",
            });
        }

        return res.status(StatusCodes.OK).json(student.cardRequest);

    } catch (error) {
        handleError(res, error);
    }
};









