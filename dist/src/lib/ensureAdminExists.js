import dotenv from 'dotenv';
import Admin, { ADMIN_TYPES } from '../models/Admin.model.js';
dotenv.config();
const Admins = [{
        email: "admin@gmail.com",
        password: "password",
        role: [ADMIN_TYPES.ADMIN, ADMIN_TYPES.SUPER_ADMIN]
    }];
export const ensureAdminExists = async () => {
    for (let index = 0; index < Admins.length; index++) {
        await Admin.findOneAndUpdate({ email: Admins[index].email, password: Admins[index].password, role: Admins[index].role }, {}, { upsert: true });
    }
};
//# sourceMappingURL=ensureAdminExists.js.map