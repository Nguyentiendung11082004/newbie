
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes";
export const handleError = (res: Response, error: unknown) => {
    if (error instanceof Error) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
    return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Đã có lỗi xảy ra' });
  };