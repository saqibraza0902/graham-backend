import { Request, Response } from "express"
import { CreateResponse } from "../../utils/user/CreateResponse.js"
import Subscription from "../../models/Subscription.model.js"

export const getAllUserSubscription = async (req: Request, res: Response) => {
    try {
        const subscriptions = await Subscription.find({ draft: false })
        return CreateResponse({ data: subscriptions, res, statusCode: 200 })
    } catch (error: any) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 })
    }
}