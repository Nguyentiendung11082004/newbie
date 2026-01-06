import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { handleError } from "../middlewares/error";
import StudentWallet from "../model/studentwallets";
import Transaction from "../model/transaction";
import Enrollment from "../model/enrollment";
import crypto from "crypto";
import qs from "qs";
import { sendMail } from "../middlewares/email";
interface CustomRequest extends Request {
    user: {
        _id: string;
        role: string;
        email: string;
        userId: string;
    };
}
const sortObject = (obj: any) => {
    const sorted: any = {};
    const keys = Object.keys(obj).sort();

    keys.forEach((key) => {
        sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, "+");
    });

    return sorted;
};

// interface Transaction {
//     type: "topup" | "payment" | "refund";
//     amount: number;
//     createdAt: Date;
//     description?: string | null;
// }

// // hàm lấy ví
// export const getWalletById = async (req: CustomRequest, res: Response) => {
//     try {
//         const { userId } = req.user;
//         console.log("userId", userId)
//         let data = await StudentWallet.findOne({ student_id: userId })
//             // .populate('student', 'name email studentCode')
//             .populate('student_id', 'name email StudentCode');
//         if (!data) {
//             data = await StudentWallet.create({
//                 student_id: userId,
//                 balance: 0,
//                 transactions: []
//             });
//         }
//         if (!data) {
//             return res.status(StatusCodes.BAD_REQUEST).json({
//                 message: 'Not found'
//             })
//         }
//         if (data?.transactions) {
//             data.transactions = data.transactions.sort(
//                 (a: any, b: any) =>
//                     new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//             );
//         }
//         return res.status(StatusCodes.OK).json({
//             message: 'Thành công',
//             data: data
//         })
//     } catch (error) {
//         handleError(res, error)
//     }
// }
// // hàm nạp
// export const topUpWallter = async (req: CustomRequest, res: Response) => {
//     try {
//         const { userId } = req.user;
//         const { type, amount, description } = req.body;

//         if (!amount || amount <= 0) {
//             return res.status(StatusCodes.BAD_REQUEST).json({
//                 message: "Số tiền nạp phải lớn hơn 0",
//             });
//         }

//         let wallet = await StudentWallet.findOne({ student_id: userId });

//         if (!wallet) {
//             // Tạo ví nếu chưa có
//             wallet = new StudentWallet({ student_id: userId });
//             await wallet.save(); // phải lưu trước để có _id
//         }

//         // Gọi addTransaction
//         await addTransaction(userId, {
//             type,
//             amount,
//             description: description || "Nạp tiền",
//         });

//         // Trả lại ví mới nhất
//         const updatedWallet = await StudentWallet.findOne({ student_id: userId });

//         return res.status(StatusCodes.OK).json({
//             message: "Nạp tiền thành công",
//             data: updatedWallet,
//             StatusCodes: 200
//         });
//     } catch (error) {
//         handleError(res, error);
//     }
// };

// // hàm thanh toán
// export const makePayment = async (req: CustomRequest, res: Response) => {
//     try {
//         const { userId } = req.user;
//         const { amount, description, enrollmentId } = req.body;
//         let wallet: any = await StudentWallet.findOne({ student_id: userId });
//         if (wallet?.balance < amount) {
//             return res.status(StatusCodes.BAD_REQUEST).json({
//                 message: "Số dư trong ví không đủ để thực hiện thanh toán này "
//             })
//         }
//         if (!enrollmentId) {
//             return res.status(StatusCodes.BAD_REQUEST).json({
//                 message: "Không tìm thấy hoá đơn "
//             })
//         }
//         const transaction = await addTransaction(userId, {
//             type: "payment",
//             amount,
//             description: description || "Thanh toán học phí",
//         });
//         if (enrollmentId) {
//             await Enrollment.findByIdAndUpdate(enrollmentId, {
//                 status: "Approved",
//                 paymentStatus: "paid"
//             });
//         }
//         return res.status(StatusCodes.OK).json({
//             message: "Thanh toán thành công",
//             StatusCodes: StatusCodes.OK,
//             receipt: {
//                 transactionId: transaction._id,
//                 amount: transaction.amount,
//                 description: transaction.description,
//                 paymentType: transaction.type,
//                 date: transaction.createdAt,
//             },
//         });
//     } catch (error) {
//         handleError(res, error);
//     }
// }
// export const getTransactionHistory = async (req: CustomRequest, res: Response) => {
//     try {
//         const { userId } = req.user;
//         const { type, ToDate, FromDate } = req.body;
//         // 1. Lấy ví của sinh viên
//         const wallet = await StudentWallet.findOne({ student_id: userId });
//         if (!wallet) {
//             return res.status(404).json({ message: "Không tìm thấy ví của sinh viên" });
//         }
//         // 2. Lọc transaction trong ví
//         let filteredTransactions = wallet.transactions as Transaction[];
//         if (type) {
//             filteredTransactions = filteredTransactions.filter((t: any) => t.type === type);
//         }

//         if (FromDate) {
//             filteredTransactions = filteredTransactions.filter((t: any) => new Date(t.createdAt) >= new Date(FromDate));
//         }

//         if (ToDate) {
//             filteredTransactions = filteredTransactions.filter((t: any) => new Date(t.createdAt) <= new Date(ToDate));
//         }

//         console.log("filteredTransactions", filteredTransactions)
//     } catch (error) {
//         handleError(res, error)
//     }
// }


// // hàm lấy công nợ cần thanh toán 
// export const getDebtWallter = async (req: CustomRequest, res: Response) => {
//     try {

//         const { userId } = req.user;
//         const debts = await Enrollment.find({
//             student_id: userId,
//             paymentStatus: "pending"
//         })

//             .populate({
//                 path: "teaching_assignment_id",
//                 populate: [
//                     { path: "subject_id", select: "name credits tuitionFee" },
//                     { path: "class_id", select: "ClassName" }
//                 ]
//             })
//             .lean();
//         return res.status(StatusCodes.OK).json({
//             message: 'Thành công',
//             data: debts
//         })
//         // console.log("debts",debts)
//     } catch (error) {
//         handleError(res, error);
//     }
// }


// hàm lấy ví
export const getWalletById = async (req: CustomRequest, res: Response) => {
    try {
        const { userId } = req.user;
        let data = await StudentWallet.findOne({ student_id: userId })
            .populate('student_id', 'name email StudentCode');
        if (!data) {
            data = await StudentWallet.create({
                student_id: userId,
                balance: 0,
                transactions: []
            });
        }
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
// hàm nạp
export const topUpWallet = async (req: CustomRequest, res: Response) => {
    try {
        const { userId } = req.user;
        const { amount, description } = req.body;

        if (!amount || amount <= 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Số tiền nạp phải lớn hơn 0",
            });
        }

        let wallet = await StudentWallet.findOne({ student_id: userId });
        if (!wallet) {
            wallet = await StudentWallet.create({
                student_id: userId,
                balance: 0
            });
        }

        // 1️⃣ Cập nhật số dư
        wallet.balance += amount;
        await wallet.save();

        // 2️⃣ Tạo transaction riêng
        const transaction = await Transaction.create({
            student_id: userId,
            wallet_id: wallet._id,
            type: "topup",
            amount,
            description: description || "Nạp tiền"
        });

        return res.status(StatusCodes.OK).json({
            message: "Nạp tiền thành công",
            data: {
                wallet,
                transaction
            }
        });

    } catch (error) {
        handleError(res, error);
    }
};

export const makePayment = async (req: CustomRequest, res: Response) => {
    try {
        const { userId } = req.user;
        const { enrollmentId } = req.body;
        if (!enrollmentId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Không tìm thấy hoá đơn "
            })
        }
        const enrollment: any = await Enrollment.findById(enrollmentId)
            .populate({
                path: "teaching_assignment_id",
                populate: {
                    path: "subject_id",
                    select: "tuitionFee"
                }
            })
        if (!enrollment) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "Không tìm thấy enrollment"
            });
        }

        if (enrollment.student_id.toString() !== userId) {
            return res.status(StatusCodes.FORBIDDEN).json({
                message: "Không có quyền thanh toán enrollment này"
            });
        }

        if (enrollment.paymentStatus === "paid") {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Enrollment đã được thanh toán"
            });
        }
        const amount = enrollment.teaching_assignment_id.subject_id.tuitionFee;
        // 4️⃣ Lấy ví
        const wallet = await StudentWallet.findOne({ student_id: userId });
        if (!wallet) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Chưa có ví"
            });
        }

        // 5️⃣ Check số dư
        if (wallet.balance < amount) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Số dư không đủ"
            });
        }


        // 6️⃣ Trừ tiền
        wallet.balance -= amount;
        await wallet.save();

        // 7️⃣ Tạo transaction
        const transaction = await Transaction.create({
            student_id: userId,
            wallet_id: wallet._id,
            enrollment_id: enrollment._id,
            type: "payment",
            amount,
            payment_method: "wallet",
            description: "Thanh toán học phí"
        });

        // 8️⃣ Update enrollment
        enrollment.paymentStatus = "paid";
        enrollment.status = "Approved";
        enrollment.paidAt = new Date();
        await enrollment.save();

        return res.status(StatusCodes.OK).json({
            message: "Thanh toán thành công",
            data: {
                transaction,
                balance: wallet.balance
            }
        });
    } catch (error) {
        handleError(res, error);
    }
}

export const refundPayment = async (req: CustomRequest, res: Response) => {
    try {
        const { enrollmentId } = req.body;

        const enrollment: any = await Enrollment.findById(enrollmentId);
        if (!enrollment || enrollment.paymentStatus !== "paid") {
            return res.status(400).json({ message: "Enrollment chưa được thanh toán" });
        }

        const wallet = await StudentWallet.findOne({ student_id: enrollment.student_id });
        if (!wallet) {
            return res.status(404).json({ message: "Không tìm thấy ví" });
        }

        const amount = enrollment.price;

        // cộng tiền
        wallet.balance += amount;
        await wallet.save();

        // transaction
        const transaction = await Transaction.create({
            student_id: enrollment.student_id,
            wallet_id: wallet._id,
            enrollment_id: enrollment._id,
            type: "refund",
            amount,
            payment_method: "wallet",
            description: "Hoàn tiền học phí"
        });

        enrollment.paymentStatus = "refunded";
        await enrollment.save();

        return res.status(200).json({
            message: "Hoàn tiền thành công",
            data: {
                transaction,
                balance: wallet.balance
            }
        });
    } catch (error) {
        handleError(res, error);
    }
};

export const topUpIntent = async (req: CustomRequest, res: Response) => {
    try {
        const { userId } = req.user;
        const { amount } = req.body;

        const wallet = await StudentWallet.findOneAndUpdate(
            { student_id: userId },
            {},
            { upsert: true, new: true }
        );

        const transaction = await Transaction.create({
            student_id: userId,
            wallet_id: wallet._id,
            type: "topup",
            amount,
            payment_method: "vnpay",
            status: "pending",
            description: "Nạp tiền vào ví"
        });

        const ipAddr =
            req.headers["x-forwarded-for"] ||
            req.socket.remoteAddress ||
            "127.0.0.1";

        const date = new Date();
        const createDate = date
            .toISOString()
            .replace(/[-T:.Z]/g, "")
            .slice(0, 14);

        let vnpParams: any = {
            vnp_Version: "2.1.0",
            vnp_Command: "pay",
            vnp_TmnCode: process.env.VNP_TMN_CODE,
            vnp_Locale: "vn",
            vnp_CurrCode: "VND",
            vnp_TxnRef: transaction._id.toString(),
            vnp_OrderInfo: `Nap vi sinh vien ${userId}`,
            vnp_OrderType: "billpayment",
            vnp_Amount: amount * 100,
            vnp_ReturnUrl: process.env.VNP_RETURN_URL,
            vnp_IpAddr: ipAddr,
            vnp_CreateDate: createDate
        };

        vnpParams = sortObject(vnpParams);

        const signData = qs.stringify(vnpParams, { encode: false });
        const hmac = crypto.createHmac("sha512", process.env.VNP_HASH_SECRET!);
        const secureHash = hmac.update(signData).digest("hex");

        vnpParams.vnp_SecureHash = secureHash;

        const paymentUrl =
            process.env.VNP_URL +
            "?" +
            qs.stringify(vnpParams, { encode: false });

        return res.json({
            paymentUrl
        });
    } catch (error) {
        handleError(res, error);
    }
};

export const vnpayCallback = async (req: Request, res: Response) => {
    try {
        const { transactionId, status } = req.query;

        if (!transactionId || !status) {
            return res.status(400).json({ message: "Thiếu dữ liệu callback" });
        }

        // 1️⃣ Lấy transaction
        const transaction: any = await Transaction.findById(transactionId);
        if (!transaction) {
            return res.status(404).json({ message: "Transaction không tồn tại" });
        }

        // 2️⃣ Chỉ xử lý pending
        if (transaction.status !== "pending") {
            return res.status(400).json({ message: "Transaction đã được xử lý" });
        }

        // 3️⃣ Fail
        if (status !== "success") {
            transaction.status = "failed";
            await transaction.save();

            return res.status(200).json({
                message: "Thanh toán thất bại",
                transaction
            });
        }

        // 4️⃣ Success → cộng tiền
        const wallet = await StudentWallet.findById(transaction.wallet_id);
        if (!wallet) {
            return res.status(404).json({ message: "Không tìm thấy ví" });
        }

        wallet.balance += transaction.amount;
        await wallet.save();

        transaction.status = "success";
        await transaction.save();

        return res.status(200).json({
            message: "Nạp tiền thành công",
            data: {
                transaction,
                balance: wallet.balance
            }
        });

    } catch (error) {
        handleError(res, error)
    }
}
export const payEnrollmentOnline = async (req: CustomRequest, res: Response) => {
    const { userId } = req.user;
    const { enrollmentId } = req.body;

    const enrollment: any = await Enrollment.findById(enrollmentId)
        .populate({
            path: "teaching_assignment_id",
            populate: { path: "subject_id" }
        });

    if (!enrollment) {
        return res.status(404).json({ message: "Enrollment không tồn tại" });
    }

    if (enrollment.student_id.toString() !== userId) {
        return res.status(403).json({ message: "Không có quyền" });
    }

    if (enrollment.paymentStatus === "paid") {
        return res.status(400).json({ message: "Đã thanh toán" });
    }
    const wallet: any = await StudentWallet.findOne({ student_id: userId });
    const amount = enrollment.teaching_assignment_id.subject_id.tuitionFee;
    const transaction = await Transaction.create({
        student_id: userId,
        enrollment_id: enrollment._id,
        wallet_id: wallet._id,
        type: "payment",
        amount: amount,
        payment_method: "vnpay",
        status: "Pending",
        description: "Thanh toán học phí online"
    });

    const ipAddr =
        req.headers["x-forwarded-for"] ||
        req.socket.remoteAddress ||
        "127.0.0.1";
    const date = new Date();
    const createDate = date
        .toISOString()
        .replace(/[-T:.Z]/g, "")
        .slice(0, 14);

    let vnpParams: any = {
        vnp_Version: "2.1.0",
        vnp_Command: "pay",
        vnp_TmnCode: process.env.VNP_TMN_CODE,
        vnp_Locale: "vn",
        vnp_CurrCode: "VND",
        vnp_TxnRef: transaction._id.toString(),
        vnp_OrderInfo: `Thanh toán tiền học phí`,
        vnp_OrderType: "billpayment",
        vnp_Amount: amount * 100,
        vnp_ReturnUrl: process.env.VNP_RETURN_URL,
        vnp_IpAddr: ipAddr,
        vnp_CreateDate: createDate
    };

    vnpParams = sortObject(vnpParams);

    const signData = qs.stringify(vnpParams, { encode: false });

    const hmac = crypto.createHmac(
        "sha512",
        process.env.VNP_HASH_SECRET!.trim()
    );

    const secureHash = hmac.update(signData, "utf-8").digest("hex");

    vnpParams.vnp_SecureHash = secureHash;

    const paymentUrl =
        process.env.VNP_URL + "?" + qs.stringify(vnpParams, { encode: false });

    return res.json({ paymentUrl });
};
export const ResultVnpayCallback = async (req: Request, res: Response) => {
    let vnpParams: any = { ...req.query };

    const secureHash = vnpParams.vnp_SecureHash;
    delete vnpParams.vnp_SecureHash;
    delete vnpParams.vnp_SecureHashType;

    // RE-ENCODE giống VNPay
    Object.keys(vnpParams).forEach((key) => {
        vnpParams[key] = encodeURIComponent(vnpParams[key] as string).replace(/%20/g, "+");
    });

    // sort A-Z
    vnpParams = Object.keys(vnpParams)
        .sort()
        .reduce((acc: any, key) => {
            acc[key] = vnpParams[key];
            return acc;
        }, {});

    const signData = qs.stringify(vnpParams, { encode: false });

    const signed = crypto
        .createHmac("sha512", process.env.VNP_HASH_SECRET!.trim())
        .update(signData, "utf-8")
        .digest("hex");

    if (secureHash !== signed) {
        return res.status(400).json({ message: "Sai chữ ký" });
    }

    // 2️⃣ xử lý kết quả
    const transaction = await Transaction.findById(vnpParams.vnp_TxnRef);
    if (!transaction) {
        return res.status(404).json({ message: "Transaction không tồn tại" });
    }

    if (transaction.status !== "Pending") {
        return res.redirect("/payment-result?status=processed");
    }

    if (vnpParams.vnp_ResponseCode !== "00") {
        transaction.status = "Failed";
        await transaction.save();
        return res.redirect("/payment-result?status=failed");
    }

    // 3️⃣ thành công
    transaction.status = "Success";
    await transaction.save();

    if (transaction.type === "topup") {
        const wallet: any = await StudentWallet.findById(transaction.wallet_id);
        wallet.balance += transaction.amount;
        await wallet.save();
    }

    if (transaction.type === "payment") {
        await Enrollment.findByIdAndUpdate(transaction.enrollment_id, {
            paymentStatus: "paid",
            status: "Approved",
        });
    }
    const enrollment: any = await Enrollment.findById(transaction.enrollment_id)
        .populate({
            path: 'teaching_assignment_id',
            populate: {
                path: 'subject_id',
                model: 'Subject',
            }
        })
        .populate('student_id');
    const tenhs: any = enrollment.student_id;
    const monhoc: any = (enrollment.teaching_assignment_id as any).subject_id;
    await sendMail(
        tenhs.email,
        'Thanh toán thành công',
        `<h3>Xin chào ${tenhs.name},</h3>
         <p>Bạn đã thanh toán thành công học phí
          cho môn <strong>${monhoc.name}</strong>.</p>
         <p>Mã lớp: ${monhoc.code}</p>
         <p>Cảm ơn bạn!</p>`
    );
    return res.redirect("http://localhost:5173/student/subjects");

};

// lich su giao dich
export const getTransactions = async (req: CustomRequest, res: Response) => {
    try {
        const { userId } = req.user;
        const { type, fromDate, toDate, page = 1, limit = 10 } = req.query;

        const filter: any = { student_id: userId };

        if (type) {
            filter.type = type;
        }

        if (fromDate || toDate) {
            filter.createdAt = {};
            if (fromDate) filter.createdAt.$gte = new Date(fromDate as string);
            if (toDate) filter.createdAt.$lte = new Date(toDate as string);
        }
        const skip = (Number(page) - 1) * Number(limit);

        const [transactions, total] = await Promise.all([
            Transaction.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit)),
            Transaction.countDocuments(filter)
        ]);

        return res.status(StatusCodes.OK).json({
            message: "Lấy lịch sử giao dịch thành công",
            data: transactions,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / Number(limit))
            }
        });

    } catch (error) {
        handleError(res, error);
    }
};
export const getAllTransactions = async (req: Request, res: Response) => {
    try {
        const {
            page = 1,
            limit = 10,
            type,
            status,
            studentId,
            fromDate,
            toDate
        } = req.query;

        const filter: any = {};

        if (type) filter.type = type;
        if (status) filter.status = status;
        if (studentId) filter.student_id = studentId;

        if (fromDate || toDate) {
            filter.createdAt = {};
            if (fromDate) filter.createdAt.$gte = new Date(fromDate as string);
            if (toDate) filter.createdAt.$lte = new Date(toDate as string);
        }

        const skip = (Number(page) - 1) * Number(limit);

        const [transactions, total] = await Promise.all([
            Transaction.find(filter)
                .populate("student_id", "name email StudentCode")
                .populate("enrollment_id", "subject_id class_id semester_id")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit)),
            Transaction.countDocuments(filter)
        ]);

        return res.status(200).json({
            message: "Lấy danh sách giao dịch thành công",
            data: transactions,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / Number(limit))
            }
        });

    } catch (error) {
        handleError(res, error);
    }
};

