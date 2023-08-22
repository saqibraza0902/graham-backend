import { CreateResponse } from "../../utils/user/CreateResponse.js";
import Subscription from "../../models/Subscription.model.js";
export const getAllUserSubscription = async (req, res) => {
    try {
        const subscriptions = await Subscription.find({ draft: false });
        return CreateResponse({ data: subscriptions, res, statusCode: 200 });
    }
    catch (error) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 });
    }
};
//# sourceMappingURL=subscription.user.controller.js.map