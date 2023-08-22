import Order from "../../models/Order.js";
import { ORDER_STATUS_ENUM } from "../../utils/enums.js";
import Add from "../../models/Add.model.js";
import { CreateResponse } from "../../utils/user/CreateResponse.js";
import mongoose from "mongoose";
export const seller_account_analytics = async (req, res) => {
    try {
        const uid = new mongoose.Types.ObjectId(req.user._id);
        // TODO: GET DATA FROM USER STRIPE ACCOUNT
        const total_earnings = 0;
        const total_orders = await Order.count({ seller: uid });
        const total_completed_orders = await Order.count({ seller: uid, order_status: ORDER_STATUS_ENUM.COMPLETED });
        const total_products = await Add.count({ created_by: uid });
        const published_properties = await Add.count({ created_by: uid, disabled: false });
        const un_published_properties = await Add.count({ created_by: uid, disabled: true });
        return CreateResponse({
            data: {
                total_orders,
                total_completed_orders,
                total_products,
                published_properties,
                un_published_properties,
                total_earnings
            }, res, statusCode: 200
        });
    }
    catch (error) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 });
    }
};
//# sourceMappingURL=user.user.controller.js.map