import { Request, Response } from "express"
import { CreateResponse } from "../utils/user/CreateResponse.js"
import { createSubscriptionValidator } from "../validators/subscription.validators.js"
import Subscription from "../models/Subscription.model.js"
import { isValidMongooseId } from "../utils/isValidMongooseId.js"

export const createSubscription = async (req: Request, res: Response) => {
    try {
        const body = await createSubscriptionValidator.validate(req.body)
        const subscription = await Subscription.create(body)
        return CreateResponse({ data: subscription, res, statusCode: 200 })
    } catch (error: any) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 })
    }
}
export const deleteSubscription = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string }
        await Subscription.findByIdAndDelete(id)
        return CreateResponse({ data: { msg: "success" }, res, statusCode: 200 })
    } catch (error: any) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 })
    }
}

export const getAllSubscriptions = async (req: Request, res: Response) => {
    try {
        const subscriptions = await Subscription.find({})
        return CreateResponse({ data: subscriptions, res, statusCode: 200 })
    } catch (error: any) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 })
    }
}
export const getAllSubscriptionsWithFilters = async (req: Request, res: Response) => {
    try {
        let { limit, page } = req.query as unknown as {
            page: number,
            limit: number
        }
        page = page ?? 1
        limit = limit ?? 5
        const skip = (page - 1) * limit
        const subscriptions = await Subscription.find({}, {}, { limit, skip })
        const totalDocuments = await Subscription.count({})
        return CreateResponse({ data: { subscriptions, totalDocuments }, res, statusCode: 200 })
    } catch (error: any) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 })
    }
}

export const updateSubscription = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string }
        const dbsubscription = await Subscription.findById(id)
        if (!dbsubscription) {
            return CreateResponse({ data: { msg: "Data not found." }, res, statusCode: 200 })
        }
        const body = await createSubscriptionValidator.validate(req.body)
        const updated = await Subscription.findByIdAndUpdate(id, {
            $set: {
                ...body
            }
        })
        return CreateResponse({ data: updated, res, statusCode: 200 })
    } catch (error: any) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 })
    }
}
export const getSingleSubscription = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string }
        const isValidID = isValidMongooseId(id)
        if (!isValidID) {
            return CreateResponse({ data: { msg: "Invalid ID" }, res, statusCode: 400 })
        }
        const dbsubscription = await Subscription.findById(id)
        if (!dbsubscription) {
            return CreateResponse({ data: { msg: "Subscription not found" }, res, statusCode: 400 })
        }

        return CreateResponse({ data: dbsubscription, res, statusCode: 200 })
    } catch (error: any) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 })
    }
}
