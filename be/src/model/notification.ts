import { required } from "joi";
import mongoose, { PaginateModel } from "mongoose";
interface INotification {
    title: String;
    content: String;
}
const NotificationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
}, {
    timestamps: true, versionKey: false
})

const Notification = mongoose.model<INotification, PaginateModel<INotification>>("Notification", NotificationSchema);
export default Notification