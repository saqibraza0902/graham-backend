import { Request, Response } from "express"
import { CreateResponse } from "../utils/user/CreateResponse.js"
import { isValidMongooseId } from "../utils/isValidMongooseId.js"
import Order from "../models/Order.js"
import Add from "../models/Add.model.js"
import { ORDER_STATUS_ENUM, PAYMENT_STATUS_ENUM } from "../utils/enums.js"
import { PipelineOptions } from "stream"
import { PipelineStage } from "mongoose"

export const getCompletedOrdersOfAProduct = async (req: Request, res: Response) => {
    try {
        let { limit, page } = req.query as unknown as {
            page: number,
            limit: number
        }
        page = page ?? 1
        limit = limit ?? 5
        const skip = (page - 1) * limit
        const { pid } = req.params as {
            pid: string
        }
        const isValid = isValidMongooseId(pid)
        if (!isValid) {
            return CreateResponse({ data: { msg: "Invalid ID" }, res, statusCode: 400 })
        }
        const dbProduct = await Add.findById(pid)
        if (!dbProduct) {
            return CreateResponse({ data: { msg: "Product not found." }, res, statusCode: 400 })
        }
        const completedOrders = await Order.find({ product: pid, order_status: ORDER_STATUS_ENUM.COMPLETED }, {}, { skip, limit }).populate("buyer", "-password")
        const totalDocuments = await Order.count({ product: pid, order_status: ORDER_STATUS_ENUM.COMPLETED })
        return CreateResponse({ data: { orders: completedOrders, totalDocuments }, res, statusCode: 200 })
    } catch (error: any) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 })
    }
}


export const getSellerAllOrdersWithFiltration = async (req: Request, res: Response) => {
    try {
        let { limit, page } = req.query as unknown as {
            page: number,
            limit: number
        }
        page = page ?? 1
        limit = limit ?? 5
        const skip = (page - 1) * limit
        const { seller_id } = req.params as {
            seller_id: string
        }
        const isValid = isValidMongooseId(seller_id)
        if (!isValid) {
            return CreateResponse({ data: { msg: "Invalid ID" }, res, statusCode: 400 })
        }
        const orders = await Order.find({ seller: seller_id }, {}, { skip, limit }).populate("buyer", "-password").populate("product")
        const totalDocuments = await Order.count({ seller: seller_id })
        return CreateResponse({ data: { orders, totalDocuments }, res, statusCode: 200 })
    } catch (error: any) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 })
    }
}


export const getAllOrderListingsWithFiltration = async (req: Request, res: Response) => {
    try {
        let { limit, page } = req.query as unknown as {
            page: number,
            limit: number
        }
        page = page ?? 1
        limit = limit ?? 5
        const skip = (page - 1) * limit
        const orders = await Order.find({}, {}, { limit, skip, sort: { createdAt: -1 } }).populate("product").populate("buyer", "-password").populate("seller", "-password")
        const totalDocuments = await Order.count({})
        return CreateResponse({ data: { orders, totalDocuments }, res, statusCode: 200 })
    } catch (error: any) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 })
    }
}


export const getSingleOrderDetails = async (req: Request, res: Response) => {
    try {
        const { order_id } = req.params as {
            order_id: string
        }
        const isValid = isValidMongooseId(order_id)
        if (!isValid) {
            return CreateResponse({ data: { msg: "Invalid ID" }, res, statusCode: 400 })
        }
        const dbOrder = await Order.findById(order_id).populate("product").populate("buyer", "-password").populate("seller", "-password")
        return CreateResponse({ data: dbOrder, res, statusCode: 200 })
    } catch (error: any) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 })
    }
}


export const getSubscriptionOrdersOnlyWithFiltration = async (req: Request, res: Response) => {
    try {
        let { limit, page, end_date, start_date } = req.query as unknown as {
            page: number,
            limit: number,
            start_date: string,
            end_date: string
        }
        page = page ? Number(page) : 1
        limit = limit ? Number(limit) : 5
        const skip = (page - 1) * limit
        let pipelines: PipelineStage[] = [
            {
                $lookup: {
                    from: 'adds', // Replace with the actual name of the products collection
                    localField: 'product',
                    foreignField: '_id',
                    as: 'productInfo',
                },
            },
            {
                $unwind: '$productInfo',
            },
            {
                $match: {
                    'productInfo.plan': { $exists: true, $ne: null },
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'buyer',
                    foreignField: '_id',
                    as: 'buyerInfo',
                },
            },
            {
                $unwind: '$buyerInfo',
            },
            {
                $project: {
                    'buyerInfo.password': 0, // Exclude the password field
                },
            },
        ]
        if (start_date && end_date) {
            pipelines.push({
                $match: {
                    createdAt: {
                        $gte: new Date(start_date),
                        $lte: new Date(end_date),
                    },
                },
            });

        }
        pipelines.push(
            {
                $skip: skip,
            },
            {
                $facet: {
                    paginatedResults: [
                        { $skip: skip },
                        { $limit: limit },
                    ],
                    totalCount: [
                        { $count: 'count' },
                    ],
                },
            },
        )
        const orders = await Order.aggregate(pipelines);
        const paginatedResults = orders[0].paginatedResults;
        const totalCount = orders[0].totalCount[0] ? orders[0].totalCount[0].count : 0;
        return CreateResponse({ data: { orders: paginatedResults, totalDocuments: totalCount }, res, statusCode: 200 })
    } catch (error: any) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 })
    }
}


export const orders_with_payment_status_payed = async (req: Request, res: Response) => {
    try {
        let { limit, page, end_date, start_date } = req.query as unknown as {
            page?: number,
            limit?: number,
            start_date?: string
            end_date?: string
        }
        page = page ?? 1
        limit = limit ?? 5
        const skip = (page - 1) * limit
        let query = {
            payment_status: PAYMENT_STATUS_ENUM.PAID
        }
        if (start_date && end_date) {
            query['createdAt'] = {
                $gte: new Date(start_date),
                $lte: new Date(end_date)
            }
        }
        const orders = await Order.find(
            query,
            {},
            { limit, skip }
        )
            .populate("buyer", "-password")
            .populate("seller", "-password")
            .populate("product")
        const totalDocuments = await Order.count(query)
        return CreateResponse({ data: { orders, totalDocuments }, res, statusCode: 200 })
    } catch (error: any) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 })
    }
}