import { Request, Response } from "express"
import Student from "../model/student"
import { StatusCodes } from "http-status-codes";
import { handleError } from "../middlewares/error";
import * as XLSX from 'xlsx';
import path from "path";

export const getAllStudents = async (req: Request, res: Response) => {
    console.log("chay")
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