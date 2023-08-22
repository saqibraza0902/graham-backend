import mongoose, { Types } from "mongoose";
export enum NOTIFICATION_TYPES_ENUM {
    INFORMATION = "INFO",
    ERROR = "ERROR",
    SUCCESS = "SUCCESS",
    OTHER = 'OTHER'
}
interface INotification {
    recipent: Types.ObjectId,
    message: string
    type: NOTIFICATION_TYPES_ENUM
}

const notificationSchema = new mongoose.Schema<INotification>({
    recipent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: NOTIFICATION_TYPES_ENUM
    }
}, {
    timestamps: true
})


const Notification = mongoose.model<INotification>('Notification', notificationSchema)

export default Notification;