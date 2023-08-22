import { CreateResponse } from "../utils/user/CreateResponse.js";
import Add from "../models/Add.model.js";
import { getUserPostsWithPaginationValidator } from "../validators/add.validators.js";
import User from "../models/User.model.js";
import { isValidMongooseId } from "../utils/isValidMongooseId.js";
import Order from "../models/Order.js";
import { ORDER_PROCESS_STATUS_ENUM, ORDER_STATUS_ENUM } from "../utils/enums.js";
export const getPostsAdd = async (req, res) => {
    try {
        let { limit, page } = req.query;
        page = page ?? 1;
        limit = limit ?? 5;
        const skip = (page - 1) * limit;
        const adds = await Add.find({}, {}, { limit, skip, sort: { createdAt: -1 } }).populate("created_by", "-password -otp -otp_expiry_time -resetToken");
        const totalDocuments = await Add.count({});
        return CreateResponse({ data: { adds, totalDocuments }, res, statusCode: 200 });
    }
    catch (error) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 });
    }
};
export const getUserPostsWithPagination = async (req, res) => {
    try {
        let { limit, page } = req.query;
        page = page ?? 1;
        limit = limit ?? 5;
        const skip = (page - 1) * limit;
        const { userId } = await getUserPostsWithPaginationValidator.validate(req.body);
        const isValidId = isValidMongooseId(userId);
        if (!isValidId) {
            return CreateResponse({ data: { msg: 'Invalid user id.' }, res, statusCode: 400 });
        }
        const dbUser = await User.findById(userId);
        if (!dbUser) {
            return CreateResponse({ data: { msg: 'User not found.' }, res, statusCode: 400 });
        }
        const adds = await Add.find({ created_by: dbUser._id }, {}, { limit, skip });
        const totalDocuments = await Add.count({ created_by: dbUser._id });
        return CreateResponse({ data: { adds, totalDocuments }, res, statusCode: 200 });
    }
    catch (error) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 });
    }
};
export const getProductWithOrdersStatuses = async (req, res) => {
    try {
        const { id } = req.params;
        const isValid = isValidMongooseId(id);
        if (!isValid) {
            return CreateResponse({ data: { msg: 'Invalid ID' }, res, statusCode: 400 });
        }
        const dbAdd = await Add.findById(id);
        if (!dbAdd) {
            return CreateResponse({ data: { msg: 'Product not found' }, res, statusCode: 400 });
        }
        const completed_orders = await Order.count({ product: id, order_status: ORDER_STATUS_ENUM.COMPLETED });
        const cancelled_orders = await Order.count({ product: id, order_status: ORDER_STATUS_ENUM.CANCELLED });
        const pending_orders = await Order.count({ product: id, order_status: ORDER_STATUS_ENUM.PENDING, 'process_status.status': ORDER_PROCESS_STATUS_ENUM.ORDERED });
        const active_orders = await Order.count({ product: id, order_status: ORDER_STATUS_ENUM.PENDING, 'process_status.status': ORDER_PROCESS_STATUS_ENUM.DELIVERED });
        return CreateResponse({
            data: {
                product: dbAdd, completed_orders, cancelled_orders, pending_orders, active_orders
            },
            res,
            statusCode: 200
        });
    }
    catch (error) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 });
    }
};
//# sourceMappingURL=add.controller.js.map