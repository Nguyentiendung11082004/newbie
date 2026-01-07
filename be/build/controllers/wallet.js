"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllTransactions = exports.getTransactions = exports.ResultVnpayCallback = exports.payEnrollmentOnline = exports.vnpayCallback = exports.topUpIntent = exports.refundPayment = exports.makePayment = exports.topUpWallet = exports.getWalletById = void 0;
const http_status_codes_1 = require("http-status-codes");
const error_1 = require("../middlewares/error");
const studentwallets_1 = __importDefault(require("../model/studentwallets"));
const transaction_1 = __importDefault(require("../model/transaction"));
const enrollment_1 = __importDefault(require("../model/enrollment"));
const crypto_1 = __importDefault(require("crypto"));
const qs_1 = __importDefault(require("qs"));
const email_1 = require("../middlewares/email");
const sortObject = (obj) => {
    const sorted = {};
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
const getWalletById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.user;
        let data = yield studentwallets_1.default.findOne({ student_id: userId })
            .populate('student_id', 'name email StudentCode');
        if (!data) {
            data = yield studentwallets_1.default.create({
                student_id: userId,
                balance: 0,
                transactions: []
            });
        }
        if (!data) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                message: 'Not found'
            });
        }
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            message: 'Thành công',
            data: data
        });
    }
    catch (error) {
        (0, error_1.handleError)(res, error);
    }
});
exports.getWalletById = getWalletById;
// hàm nạp
const topUpWallet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.user;
        const { amount, description } = req.body;
        if (!amount || amount <= 0) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                message: "Số tiền nạp phải lớn hơn 0",
            });
        }
        let wallet = yield studentwallets_1.default.findOne({ student_id: userId });
        if (!wallet) {
            wallet = yield studentwallets_1.default.create({
                student_id: userId,
                balance: 0
            });
        }
        // 1️⃣ Cập nhật số dư
        wallet.balance += amount;
        yield wallet.save();
        // 2️⃣ Tạo transaction riêng
        const transaction = yield transaction_1.default.create({
            student_id: userId,
            wallet_id: wallet._id,
            type: "topup",
            amount,
            description: description || "Nạp tiền"
        });
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            message: "Nạp tiền thành công",
            data: {
                wallet,
                transaction
            }
        });
    }
    catch (error) {
        (0, error_1.handleError)(res, error);
    }
});
exports.topUpWallet = topUpWallet;
const makePayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.user;
        const { enrollmentId } = req.body;
        if (!enrollmentId) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                message: "Không tìm thấy hoá đơn "
            });
        }
        const enrollment = yield enrollment_1.default.findById(enrollmentId)
            .populate({
            path: "teaching_assignment_id",
            populate: {
                path: "subject_id",
                select: "tuitionFee"
            }
        });
        if (!enrollment) {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                message: "Không tìm thấy enrollment"
            });
        }
        if (enrollment.student_id.toString() !== userId) {
            return res.status(http_status_codes_1.StatusCodes.FORBIDDEN).json({
                message: "Không có quyền thanh toán enrollment này"
            });
        }
        if (enrollment.paymentStatus === "paid") {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                message: "Enrollment đã được thanh toán"
            });
        }
        const amount = enrollment.teaching_assignment_id.subject_id.tuitionFee;
        // 4️⃣ Lấy ví
        const wallet = yield studentwallets_1.default.findOne({ student_id: userId });
        if (!wallet) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                message: "Chưa có ví"
            });
        }
        // 5️⃣ Check số dư
        if (wallet.balance < amount) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                message: "Số dư không đủ"
            });
        }
        // 6️⃣ Trừ tiền
        wallet.balance -= amount;
        yield wallet.save();
        // 7️⃣ Tạo transaction
        const transaction = yield transaction_1.default.create({
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
        yield enrollment.save();
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            message: "Thanh toán thành công",
            data: {
                transaction,
                balance: wallet.balance
            }
        });
    }
    catch (error) {
        (0, error_1.handleError)(res, error);
    }
});
exports.makePayment = makePayment;
const refundPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { enrollmentId } = req.body;
        const enrollment = yield enrollment_1.default.findById(enrollmentId);
        if (!enrollment || enrollment.paymentStatus !== "paid") {
            return res.status(400).json({ message: "Enrollment chưa được thanh toán" });
        }
        const wallet = yield studentwallets_1.default.findOne({ student_id: enrollment.student_id });
        if (!wallet) {
            return res.status(404).json({ message: "Không tìm thấy ví" });
        }
        const amount = enrollment.price;
        // cộng tiền
        wallet.balance += amount;
        yield wallet.save();
        // transaction
        const transaction = yield transaction_1.default.create({
            student_id: enrollment.student_id,
            wallet_id: wallet._id,
            enrollment_id: enrollment._id,
            type: "refund",
            amount,
            payment_method: "wallet",
            description: "Hoàn tiền học phí"
        });
        enrollment.paymentStatus = "refunded";
        yield enrollment.save();
        return res.status(200).json({
            message: "Hoàn tiền thành công",
            data: {
                transaction,
                balance: wallet.balance
            }
        });
    }
    catch (error) {
        (0, error_1.handleError)(res, error);
    }
});
exports.refundPayment = refundPayment;
const topUpIntent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.user;
        const { amount } = req.body;
        const wallet = yield studentwallets_1.default.findOneAndUpdate({ student_id: userId }, {}, { upsert: true, new: true });
        const transaction = yield transaction_1.default.create({
            student_id: userId,
            wallet_id: wallet._id,
            type: "topup",
            amount,
            payment_method: "vnpay",
            status: "pending",
            description: "Nạp tiền vào ví"
        });
        const ipAddr = req.headers["x-forwarded-for"] ||
            req.socket.remoteAddress ||
            "127.0.0.1";
        const date = new Date();
        const createDate = date
            .toISOString()
            .replace(/[-T:.Z]/g, "")
            .slice(0, 14);
        let vnpParams = {
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
        const signData = qs_1.default.stringify(vnpParams, { encode: false });
        const hmac = crypto_1.default.createHmac("sha512", process.env.VNP_HASH_SECRET);
        const secureHash = hmac.update(signData).digest("hex");
        vnpParams.vnp_SecureHash = secureHash;
        const paymentUrl = process.env.VNP_URL +
            "?" +
            qs_1.default.stringify(vnpParams, { encode: false });
        return res.json({
            paymentUrl
        });
    }
    catch (error) {
        (0, error_1.handleError)(res, error);
    }
});
exports.topUpIntent = topUpIntent;
const vnpayCallback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { transactionId, status } = req.query;
        if (!transactionId || !status) {
            return res.status(400).json({ message: "Thiếu dữ liệu callback" });
        }
        // 1️⃣ Lấy transaction
        const transaction = yield transaction_1.default.findById(transactionId);
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
            yield transaction.save();
            return res.status(200).json({
                message: "Thanh toán thất bại",
                transaction
            });
        }
        // 4️⃣ Success → cộng tiền
        const wallet = yield studentwallets_1.default.findById(transaction.wallet_id);
        if (!wallet) {
            return res.status(404).json({ message: "Không tìm thấy ví" });
        }
        wallet.balance += transaction.amount;
        yield wallet.save();
        transaction.status = "success";
        yield transaction.save();
        return res.status(200).json({
            message: "Nạp tiền thành công",
            data: {
                transaction,
                balance: wallet.balance
            }
        });
    }
    catch (error) {
        (0, error_1.handleError)(res, error);
    }
});
exports.vnpayCallback = vnpayCallback;
const payEnrollmentOnline = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const { enrollmentId } = req.body;
    const enrollment = yield enrollment_1.default.findById(enrollmentId)
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
    const wallet = yield studentwallets_1.default.findOne({ student_id: userId });
    const amount = enrollment.teaching_assignment_id.subject_id.tuitionFee;
    const transaction = yield transaction_1.default.create({
        student_id: userId,
        enrollment_id: enrollment._id,
        wallet_id: wallet._id,
        type: "payment",
        amount: amount,
        payment_method: "vnpay",
        status: "Pending",
        description: "Thanh toán học phí online"
    });
    const ipAddr = req.headers["x-forwarded-for"] ||
        req.socket.remoteAddress ||
        "127.0.0.1";
    const date = new Date();
    const createDate = date
        .toISOString()
        .replace(/[-T:.Z]/g, "")
        .slice(0, 14);
    let vnpParams = {
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
    const signData = qs_1.default.stringify(vnpParams, { encode: false });
    const hmac = crypto_1.default.createHmac("sha512", process.env.VNP_HASH_SECRET.trim());
    const secureHash = hmac.update(signData, "utf-8").digest("hex");
    vnpParams.vnp_SecureHash = secureHash;
    const paymentUrl = process.env.VNP_URL + "?" + qs_1.default.stringify(vnpParams, { encode: false });
    return res.json({ paymentUrl });
});
exports.payEnrollmentOnline = payEnrollmentOnline;
const ResultVnpayCallback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let vnpParams = Object.assign({}, req.query);
    const secureHash = vnpParams.vnp_SecureHash;
    delete vnpParams.vnp_SecureHash;
    delete vnpParams.vnp_SecureHashType;
    // RE-ENCODE giống VNPay
    Object.keys(vnpParams).forEach((key) => {
        vnpParams[key] = encodeURIComponent(vnpParams[key]).replace(/%20/g, "+");
    });
    // sort A-Z
    vnpParams = Object.keys(vnpParams)
        .sort()
        .reduce((acc, key) => {
        acc[key] = vnpParams[key];
        return acc;
    }, {});
    const signData = qs_1.default.stringify(vnpParams, { encode: false });
    const signed = crypto_1.default
        .createHmac("sha512", process.env.VNP_HASH_SECRET.trim())
        .update(signData, "utf-8")
        .digest("hex");
    if (secureHash !== signed) {
        return res.status(400).json({ message: "Sai chữ ký" });
    }
    // 2️⃣ xử lý kết quả
    const transaction = yield transaction_1.default.findById(vnpParams.vnp_TxnRef);
    if (!transaction) {
        return res.status(404).json({ message: "Transaction không tồn tại" });
    }
    if (transaction.status !== "Pending") {
        return res.redirect("/payment-result?status=processed");
    }
    if (vnpParams.vnp_ResponseCode !== "00") {
        transaction.status = "Failed";
        yield transaction.save();
        return res.redirect("/payment-result?status=failed");
    }
    // 3️⃣ thành công
    transaction.status = "Success";
    yield transaction.save();
    if (transaction.type === "topup") {
        const wallet = yield studentwallets_1.default.findById(transaction.wallet_id);
        wallet.balance += transaction.amount;
        yield wallet.save();
    }
    if (transaction.type === "payment") {
        yield enrollment_1.default.findByIdAndUpdate(transaction.enrollment_id, {
            paymentStatus: "paid",
            status: "Approved",
        });
    }
    const enrollment = yield enrollment_1.default.findById(transaction.enrollment_id)
        .populate({
        path: 'teaching_assignment_id',
        populate: {
            path: 'subject_id',
            model: 'Subject',
        }
    })
        .populate('student_id');
    const tenhs = enrollment.student_id;
    const monhoc = enrollment.teaching_assignment_id.subject_id;
    yield (0, email_1.sendMail)(tenhs.email, 'Thanh toán thành công', `<h3>Xin chào ${tenhs.name},</h3>
         <p>Bạn đã thanh toán thành công học phí
          cho môn <strong>${monhoc.name}</strong>.</p>
         <p>Mã lớp: ${monhoc.code}</p>
         <p>Cảm ơn bạn!</p>`);
    return res.redirect("http://localhost:5173/student/subjects");
});
exports.ResultVnpayCallback = ResultVnpayCallback;
// lich su giao dich
const getTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.user;
        const { type, fromDate, toDate, page = 1, limit = 10 } = req.query;
        const filter = { student_id: userId };
        if (type) {
            filter.type = type;
        }
        if (fromDate || toDate) {
            filter.createdAt = {};
            if (fromDate)
                filter.createdAt.$gte = new Date(fromDate);
            if (toDate)
                filter.createdAt.$lte = new Date(toDate);
        }
        const skip = (Number(page) - 1) * Number(limit);
        const [transactions, total] = yield Promise.all([
            transaction_1.default.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit)),
            transaction_1.default.countDocuments(filter)
        ]);
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            message: "Lấy lịch sử giao dịch thành công",
            data: transactions,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / Number(limit))
            }
        });
    }
    catch (error) {
        (0, error_1.handleError)(res, error);
    }
});
exports.getTransactions = getTransactions;
const getAllTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, limit = 10, type, status, studentId, fromDate, toDate } = req.query;
        const filter = {};
        if (type)
            filter.type = type;
        if (status)
            filter.status = status;
        if (studentId)
            filter.student_id = studentId;
        if (fromDate || toDate) {
            filter.createdAt = {};
            if (fromDate)
                filter.createdAt.$gte = new Date(fromDate);
            if (toDate)
                filter.createdAt.$lte = new Date(toDate);
        }
        const skip = (Number(page) - 1) * Number(limit);
        const [transactions, total] = yield Promise.all([
            transaction_1.default.find(filter)
                .populate("student_id", "name email StudentCode")
                .populate("enrollment_id", "subject_id class_id semester_id")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit)),
            transaction_1.default.countDocuments(filter)
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
    }
    catch (error) {
        (0, error_1.handleError)(res, error);
    }
});
exports.getAllTransactions = getAllTransactions;
