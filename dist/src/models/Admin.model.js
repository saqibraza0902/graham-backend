import mongoose from "mongoose";
export var ADMIN_TYPES;
(function (ADMIN_TYPES) {
    ADMIN_TYPES["ADMIN"] = "ADMIN";
    ADMIN_TYPES["SUPER_ADMIN"] = "SUPER_ADMIN";
})(ADMIN_TYPES || (ADMIN_TYPES = {}));
const adminSchema = new mongoose.Schema({
    email: String,
    password: String,
    role: {
        type: [String],
        default: [ADMIN_TYPES.ADMIN]
    }
}, {
    timestamps: true
});
const Admin = mongoose.model("admins", adminSchema);
export default Admin;
//# sourceMappingURL=Admin.model.js.map