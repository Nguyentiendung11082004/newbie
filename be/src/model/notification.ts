import mongoose, { PaginateModel } from "mongoose";

interface INotification {
  title: string;
  content: string;
  sender_id: mongoose.Types.ObjectId;  // người gửi (admin hoặc teacher)
  sender_role: "admin" | "teacher";     // vai trò người gửi
  target_type: "all" | "student" | "teacher" | "class" | "subject";  // phạm vi gửi
  class_id?: mongoose.Types.ObjectId;   // nếu gửi cho 1 lớp
  subject_id?: mongoose.Types.ObjectId; // nếu gửi cho 1 môn học
}

const NotificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    sender_id: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "sender_role",
      required: true,
    },
    sender_role: {
      type: String,
      enum: ["admin", "teacher"],
      required: true,
    },
    target_type: {
      type: String,
      enum: ["all", "student", "teacher", "class", "subject"],
      default: "all",
    },
    class_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
    },
    subject_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Notification = mongoose.model<INotification, PaginateModel<INotification>>(
  "Notification",
  NotificationSchema
);

export default Notification;
