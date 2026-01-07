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
Object.defineProperty(exports, "__esModule", { value: true });
exports.addTransaction = void 0;
const addTransaction = (studentId, transaction) => __awaiter(void 0, void 0, void 0, function* () {
    // const wallet = await StudentWallet.findOne({ student_id: studentId });
    // if (!wallet) {
    //   throw new Error("Không tìm thấy ví sinh viên để thêm giao dịch");
    // }
    // // Thêm giao dịch mới vào mảng transactions
    // wallet.transactions.push(transaction);
    // // Cập nhật số dư (nếu cần)
    // if (transaction.type === "topup" || transaction.type === "refund") {
    //   wallet.balance += transaction.amount;
    // } else if (transaction.type === "payment") {
    //   wallet.balance -= transaction.amount;
    // }
    // // Lưu lại ví
    // await wallet.save();
    // const newTransaction = wallet.transactions[wallet.transactions.length - 1];
    // return newTransaction;
});
exports.addTransaction = addTransaction;
