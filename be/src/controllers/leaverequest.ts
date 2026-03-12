import { Request, Response } from "express"
import { handleError } from "../middlewares/error";
import Leave from "../model/leaverequest";
import { StatusCodes } from "http-status-codes";
import TeachingAssignment from "../model/teachingassignment";
import Teacher from "../model/teacher";
import { sendSSEToStudent } from "../routes/sse.route";
interface CustomRequest extends Request {
  user: {
    _id: string;
    role: string;
    email: string;
    userId: string;
    teacherId: string;
    studentId: string;
  };
  query: {
    teaching_assignment_id?: string | string[];
    from?: string;
    to?: string;
  };
}
export const GetAllLeave = async (req: CustomRequest, res: Response) => {
  try {
    const {
      _page = '1',
      _limit = '10',
      _sort = 'createAt',
      _order = 'asc',
      status,
      fromDate,
      toDate,
    } = req.body;

    const userId = req.user;
    const role = req.user?.role;

    const filter: any = {};

    if (role === 'teacher') {
      const assignments = await TeachingAssignment.find({ teacher_id: userId.teacherId });
      const teachingIds = assignments.map(a => a._id);

      if (teachingIds.length === 0) {
        return res.status(StatusCodes.OK).json({
          message: 'Không có lớp nào đang dạy',
          StatusCodes: StatusCodes.OK,
          data: [],
          pagination: {
            totalDocs: 0,
            totalPages: 0,
            page: parseInt(_page),
            limit: parseInt(_limit),
          }
        });
      }

      filter.teaching_assignment_id = { $in: teachingIds };
    }

    if (role === 'student') {
      filter.student_id = req.user.studentId;
    }

    if (status) filter.status = status;
    if (fromDate || toDate) {
      filter.fromDate = {};
      if (fromDate) filter.fromDate.$gte = new Date(fromDate);
      if (toDate) filter.fromDate.$lte = new Date(toDate);
    }

    const options = {
      page: parseInt(_page),
      limit: parseInt(_limit),
      sort: { [_sort]: _order === 'asc' ? 1 : -1 },
      populate: [
        {
          path: 'teaching_assignment_id',
          populate: [
            { path: 'subject_id', select: 'name' },
            { path: 'class_id', select: 'ClassName' },
          ]
        },
        { path: 'student_id', select: 'name studentCode' }
      ]
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
    });
  } catch (error) {
    handleError(res, error);
  }
};


export const CreateLeave = async (req: CustomRequest, res: Response) => {
  try {
    const  userId  = req.user.studentId;
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
export const ApproveLeave = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user.teacherId;
    const teacher = await Teacher.findById(userId)
    if (!teacher) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Chỉ giảng viên mới có quyền duyệt"
      })
    }
    const { leaveId } = req.body;
    const leave: any = await Leave.findById(leaveId)
      .populate({
        path: 'teaching_assignment_id',
        select: 'teacher_id',
      });
    if (!leave) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Không tìm thấy đơn xin nghỉ"
      })
    }
    if (leave.teaching_assignment_id?.teacher_id.toString() !== userId) {
      return res.status(403).json({ message: "Bạn không có quyền duyệt đơn này" });
    }
    leave.status = "approved";
    await leave.save();
    sendSSEToStudent(leave.student_id.toString(), 'Đơn xin nghỉ đã được duyệt')
    return res.status(StatusCodes.OK).json({ message: "Duyệt đơn nghỉ thành công", StatusCodes: StatusCodes.OK, leave });
  } catch (error) {
    handleError(res, error)
  }
}