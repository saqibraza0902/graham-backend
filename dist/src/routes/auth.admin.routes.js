import express from 'express';
import { CreateResponse } from '../utils/user/CreateResponse.js';
import { adminAuthLoginValidation } from '../validators/admin.auth.validators.js';
import Admin from '../models/Admin.model.js';
import { createAccessToken } from '../utils/user/createAccessToken.js';
import { requireAdminSignInMiddleware } from '../middlewares/index.js';
const router = express.Router();
router.post("/login", async (req, res) => {
    try {
        const body = await adminAuthLoginValidation.validate(req.body);
        const dbAdmin = await Admin.findOne({ email: body.email, password: body.password }).select("-password");
        if (!dbAdmin) {
            return CreateResponse({ data: { msg: 'Incorrect credentials.' }, res, statusCode: 400 });
        }
        const token = createAccessToken({ _id: String(dbAdmin._id) });
        return CreateResponse({ data: { token, user: dbAdmin }, res, statusCode: 200 });
    }
    catch (error) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 });
    }
});
router.get("/refresh-token", requireAdminSignInMiddleware, async (req, res) => {
    try {
        const dbAdmin = await Admin.findById(req.user._id).select("-password");
        const token = createAccessToken({ _id: String(dbAdmin._id) });
        return CreateResponse({ data: { token, user: dbAdmin }, res, statusCode: 200 });
    }
    catch (error) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 });
    }
});
export default router;
//# sourceMappingURL=auth.admin.routes.js.map