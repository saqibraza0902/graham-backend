import mongoose from "mongoose";
export var NOTIFICATION_TYPES_ENUM;
(function (NOTIFICATION_TYPES_ENUM) {
    NOTIFICATION_TYPES_ENUM["INFORMATION"] = "INFO";
    NOTIFICATION_TYPES_ENUM["ERROR"] = "ERROR";
    NOTIFICATION_TYPES_ENUM["SUCCESS"] = "SUCCESS";
    NOTIFICATION_TYPES_ENUM["OTHER"] = "OTHER";
})(NOTIFICATION_TYPES_ENUM || (NOTIFICATION_TYPES_ENUM = {}));
const notificationSchema = new mongoose.Schema({
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
});
const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
//# sourceMappingURL=Notification.model.js.map