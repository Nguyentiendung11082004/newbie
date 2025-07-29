import { Request, Response } from "express";
import { handleError } from "../middlewares/error";
import StudentWallet from "../model/studentwallets";
import { StatusCodes } from "http-status-codes";
import { addTransaction } from "../middlewares/wallet";
interface CustomRequest extends Request {
    user: {
        _id: string;
        role: string;
        email: string;
        userId: string;
    };
}
interface Transaction {
    type: "topup" | "payment" | "refund";
    amount: number;
    createdAt: Date;
    description?: string | null;
}

export const getWalletById = async (req: CustomRequest, res: Response) => {
    try {
        const { userId } = req.user;
        const data = await StudentWallet.findOne({ student_id: userId })
            // .populate('student', 'name email studentCode')
            .populate('student_id', 'name email StudentCode');
        if (!data) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Not found'
            })
        }
        return res.status(StatusCodes.OK).json({
            message: 'Thành công',
            data: data
        })
    } catch (error) {
        handleError(res, error)
    }
}
export const topUpWallter = async (req: CustomRequest, res: Response) => {
    try {
        const { userId } = req.user;
        const { type, amount, description } = req.body;

        if (!amount || amount <= 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Số tiền nạp phải lớn hơn 0",
            });
        }

        let wallet = await StudentWallet.findOne({ student_id: userId });

        if (!wallet) {
            // Tạo ví nếu chưa có
            wallet = new StudentWallet({ student_id: userId });
            await wallet.save(); // phải lưu trước để có _id
        }

        // Gọi addTransaction
        await addTransaction(userId, {
            type,
            amount,
            description: description || "Nạp tiền",
        });

        // Trả lại ví mới nhất
        const updatedWallet = await StudentWallet.findOne({ student_id: userId });

        return res.status(StatusCodes.OK).json({
            message: "Nạp tiền thành công",
            data: updatedWallet,
        });
    } catch (error) {
        handleError(res, error);
    }
};

export const makePayment = async (req: CustomRequest, res: Response) => {
    try {
        const { userId } = req.user;
        const { amount, description, paymentType } = req.body;
        let wallet: any = await StudentWallet.findOne({ student_id: userId });
        if (wallet?.balance < amount) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Số dư trong ví không đủ để thực hiện thanh toán này "
            })
        }
        const transaction = await addTransaction(userId, {
            type: "payment",
            amount,
            description: description || "Trừ tiền",
        });
        console.log("transaction", transaction)
        return res.status(StatusCodes.OK).json({
            message: "Thanh toán thành công",
            receipt: {
                transactionId: transaction._id,
                amount: transaction.amount,
                description: transaction.description,
                paymentType: transaction.type,
                date: transaction.createdAt,
            }
        });
    } catch (error) {
        handleError(res, error);
    }
}
export const getTransactionHistory = async (req: CustomRequest, res: Response) => {
    try {
        const { userId } = req.user;
        const { type, ToDate, FromDate } = req.body;
        // 1. Lấy ví của sinh viên
        const wallet = await StudentWallet.findOne({ student_id: userId });
        if (!wallet) {
            return res.status(404).json({ message: "Không tìm thấy ví của sinh viên" });
        }
        // 2. Lọc transaction trong ví
        let filteredTransactions = wallet.transactions as Transaction[];
        if (type) {
            filteredTransactions = filteredTransactions.filter((t: any) => t.type === type);
        }

        if (FromDate) {
            filteredTransactions = filteredTransactions.filter((t: any) => new Date(t.createdAt) >= new Date(FromDate));
        }

        if (ToDate) {
            filteredTransactions = filteredTransactions.filter((t: any) => new Date(t.createdAt) <= new Date(ToDate));
        }

        console.log("filteredTransactions", filteredTransactions)
    } catch (error) {
        handleError(res, error)
    }
}
