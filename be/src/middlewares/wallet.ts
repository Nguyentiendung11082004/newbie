import StudentWallet from "../model/studentwallets";

interface TransactionInput {
  type: "topup" | "payment" | "refund";
  amount: number;
  description?: string;
}

export const addTransaction = async (studentId: string, transaction: TransactionInput) => {
<<<<<<< HEAD
  const wallet = await StudentWallet.findOne({ student_id: studentId });

  if (!wallet) {
    throw new Error("Không tìm thấy ví sinh viên để thêm giao dịch");
  }

  // Thêm giao dịch mới vào mảng transactions
  wallet.transactions.push(transaction);

  // Cập nhật số dư (nếu cần)
  if (transaction.type === "topup" || transaction.type === "refund") {
    wallet.balance += transaction.amount;
  } else if (transaction.type === "payment") {
    wallet.balance -= transaction.amount;
  }

  // Lưu lại ví
  await wallet.save();
  const newTransaction = wallet.transactions[wallet.transactions.length - 1];

  return newTransaction;
=======
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
>>>>>>> 6c1e0219d5928377aebd76055f2ed5f81d10f102
};
