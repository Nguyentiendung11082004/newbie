import { Request, Response } from "express"
import { handleError } from "../middlewares/error";
import Leave from "../model/leaverequest";
import { StatusCodes } from "http-status-codes";
import TeachingAssignment from "../model/teachingassignment";
interface CustomRequest extends Request {
    user: {
        _id: string;
        role: string;
        email: string;
        userId: string;
    };
    query: {
        teaching_assignment_id?: string | string[];
        from?: string;
        to?: string;
    };
}
export const GetAllLeave = async (req: Request, res: Response) => {
    try {
        const {
            _page = '1',
            _limit = '10',
            _sort = 'createAt',
            _order = 'asc',
            teaching_assignment_id,
            status,
            fromDate,
            toDate,
        } = req.body;
        const filter: any = {};
        if (teaching_assignment_id) filter.teaching_assignment_id = teaching_assignment_id;
        if (status) filter.status = status;
        if (fromDate || toDate) {
            filter.fromDate = {};
            if (fromDate) filter.fromDate.$gte = new Date(fromDate);
            if (toDate) filter.fromDate.$lte = new Date(toDate);
        }
        const options = {
            page: parseInt(_page as string),
            limit: parseInt(_limit as string),
            sort: { [_sort as string]: _order === 'asc' ? 1 : -1 },
            populate: {
                path: 'teaching_assignment_id',
                populate: [
                    { path: 'subject_id', select: 'name' },
                    { path: 'class_id', select: 'ClassName' },
                ]
            }
        }
        const leave = await Leave.paginate(filter, options);
        res.status(StatusCodes.OK).json({
            message: 'Thành công',
            StatusCodes: StatusCodes.OK,
            data: leave.docs,
            pagination: {
                totalDocs: leave.totalDocs,
                totalPages: leave.totalPages,
                page: leave.page,
                limit: leave.limit
            }
        })
    } catch (error) {
        handleError(res, error)
    }
}

export const CreateLeave = async (req: CustomRequest, res: Response) => {
    try {
        const { userId } = req.user;
        const { reason, fromDate, toDate, teaching_assignment_id } = req.body;

        if (new Date(fromDate) > new Date(toDate)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Từ ngày phải nhỏ hơn hoặc bằng đến ngày"
            });
        }
        const assignment = await TeachingAssignment.findById(teaching_assignment_id);
        if (!assignment) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Môn học không hợp lệ"
            })
        }
        const leave = await Leave.create({
            student_id: userId,
            reason,
            fromDate,
            toDate,
            teaching_assignment_id,
            status: 'pending'
        })
        return res.status(StatusCodes.CREATED).json({
            data: leave,
            StatusCodes: StatusCodes.CREATED,
            message: "Gửi đơn nghỉ thành công"
        });
    } catch (error) {
        handleError(res, error)
    }
}