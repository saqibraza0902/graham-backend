import { CreateResponse } from "../../utils/user/CreateResponse.js";
import { createOrderValidator } from "../../validators/order.validators.js";
import Order from "../../models/Order.js";
import mongoose from "mongoose";
import { ORDER_STATUS_ENUM, PAYMENT_STATUS_ENUM, WEB_HOOKS_ENUM } from "../../utils/enums.js";
import Payout from "../../models/Payout.js";
import { euroIntoCents, stripe } from "../../lib/stripe.js";
import Add from "../../models/Add.model.js";
import Invoice from "../../models/Invoice.js";
import { isValidMongooseId } from "../../utils/isValidMongooseId.js";
import { change_order_process_status_validator } from "../../validators/add.validators.js";
import TempOrder from "../../models/TempOrder.model.js";
const createSingleOrder = async (req, item, billing_details) => {
    try {
        const dbProduct = await Add.findById(item.product);
        if (!dbProduct) {
            return null;
        }
        if (dbProduct.available_stock < item.quantity) {
            console.log('stock quantity is small');
            return null;
        }
        const Obj = {
            buyer: req.user._id,
            end_date: new Date(item.end_date),
            order_status: ORDER_STATUS_ENUM.PENDING,
            payment_status: PAYMENT_STATUS_ENUM.PENDING,
            // process_status: [{ date: new Date(), status: ORDER_PROCESS_STATUS_ENUM.ORDERED }],
            product: item.product,
            quantity: Number(item.quantity),
            seller: item.seller,
            seller_earned: Number(item.total_price),
            service_fee: Number(item.service_fee),
            start_date: new Date(item.start_date),
            taxes: Number(item.taxes),
            time_difference: Number(item.time_difference),
            total_price: Number(item.total_price),
            billing_details: billing_details,
            refunded_amount: dbProduct.payment_policy.deposit ? dbProduct.payment_policy.amount * item.quantity : 0,
        };
        const newOrder = await TempOrder.create(Obj);
        return newOrder._id;
    }
    catch (error) {
        return null;
    }
};
const createCheckoutLineItem = async (item) => {
    try {
        const dbProduct = await Add.findById(item.product);
        if (!dbProduct) {
            return null;
        }
        // Stripe-Products
        const stripeProduct = await stripe.products.create({
            name: `${dbProduct.add_title}`,
            images: [dbProduct.images[0]],
        });
        // Stripe-Price
        const stripePrice = await stripe.prices.create({
            unit_amount: euroIntoCents(item.total_price),
            currency: "eur",
            product: stripeProduct.id,
        });
        return {
            price: stripePrice.id,
            quantity: 1,
        };
    }
    catch (error) {
        return null;
    }
};
export const createCheckoutSession = async (req, res) => {
    try {
        const body = await createOrderValidator.validate(req.body);
        const ordersIds = [];
        for (const item of body.items) {
            // @ts-ignore
            const orderId = await createSingleOrder(req, item, body.billing_details);
            if (orderId) {
                ordersIds.push(orderId);
            }
        }
        const lineItems = [];
        for (const item of body.items) {
            const result = await createCheckoutLineItem(item);
            if (result) {
                lineItems.push(result);
            }
        }
        const newInvoice = await Invoice.create({
            items: ordersIds,
            user: req.user._id
        });
        const stripeSession = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            // payment_intent_data: {
            //     application_fee_amount: usdToCents(plateformfee),
            //     transfer_data: {
            //         destination: carUser.stripe_account_id!,
            //     },
            // },
            success_url: `${process.env.CHECKOUT_SUCCESS_URL}?invoice=${newInvoice._id}`,
            cancel_url: `${process.env.CHECKOUT_CANCEL_URL}?invoice=${newInvoice._id}`,
            mode: "payment",
            line_items: lineItems,
            metadata: {
                // invoice id:
                invoice_id: String(newInvoice._id),
                web_hook: WEB_HOOKS_ENUM.ORDER_CHECKOUT_WEBHOOK
            },
        });
        await Invoice.findByIdAndUpdate(newInvoice._id, {
            $set: {
                stripe_session_id: stripeSession.id
            }
        });
        return CreateResponse({ data: stripeSession.id, res, statusCode: 200 });
    }
    catch (error) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 });
    }
};
export const verifyOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const invoice = await Invoice.findById(id);
        if (!invoice || !invoice?.stripe_session_id) {
            return CreateResponse({ data: { msg: "Something went wrong try again later." }, res, statusCode: 400 });
        }
        const stripSession = await stripe.checkout.sessions.retrieve(invoice.stripe_session_id);
        if (stripSession.payment_status === "unpaid") {
            return res.status(400).json({ msg: "Payment was not successful try again later." });
        }
        let totalPayouts = 0;
        for (let index = 0; index < invoice.items.length; index++) {
            // UPDATE THE ORDER STATUS TO PAID.
            const dbOrder = await Order.findByIdAndUpdate(invoice.items[index], {
                $set: {
                    payment_status: PAYMENT_STATUS_ENUM.PAID,
                }
            });
            // DECREMENT THE PRODUCT STOCK BY -1.
            await Add.findByIdAndUpdate(dbOrder.product, {
                $inc: {
                    available_stock: -Number(dbOrder.quantity)
                }
            });
            // CALCULATE THE NEW TOTAL PAYOUT FOR THE USER.
            if (dbOrder) {
                totalPayouts += Number(dbOrder.total_price);
            }
        }
        // REMOVE THE SESSION AS THE PAYMENT IS SUCCESSFUL.
        await Invoice.findByIdAndUpdate(invoice._id, {
            $set: {
                stripe_session_id: ""
            }
        });
        // ADD THE PAYOUT AMOUNT TO THE USER PAYMENT DOCUMENT.
        await Payout.findOneAndUpdate({ user: invoice.user }, {
            $inc: {
                amount: totalPayouts
            }
        }, {
            upsert: true
        });
        return CreateResponse({ data: { msg: "success" }, res, statusCode: 200 });
    }
    catch (error) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 });
    }
};
export const handleCancelledOrderByStripe = async (req, res) => {
    try {
        const { id } = req.params;
        const invoice = await Invoice.findById(id);
        if (!invoice || !invoice?.stripe_session_id) {
            return CreateResponse({ data: { msg: "success" }, res, statusCode: 200 });
        }
        const stripSession = await stripe.checkout.sessions.retrieve(invoice.stripe_session_id);
        if (stripSession.payment_status === "paid") {
            return CreateResponse({ data: { msg: "success" }, res, statusCode: 200 });
        }
        await Order.deleteMany({ _id: { "$in": invoice.items } });
        return CreateResponse({ data: { msg: "success" }, res, statusCode: 200 });
    }
    catch (error) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 });
    }
};
export const last_seven_days_order_invoices = async (req, res) => {
    try {
        const dateDiff = new Date();
        dateDiff.setDate(dateDiff.getDate() - 7);
        const orders = await Order.find({
            seller: req.user._id,
            createdAt: {
                $gte: new Date(dateDiff),
                $lte: new Date()
            }
        }).limit(3);
        return CreateResponse({ data: { orders }, res, statusCode: 200 });
    }
    catch (error) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 });
    }
};
export const get_seller_orders = async (req, res) => {
    try {
        let { limit, page, title } = req.query;
        page = page ?? 1;
        limit = limit ?? 5;
        const skip = (page - 1) * limit;
        const { seller_id } = req.params;
        const isValid = isValidMongooseId(seller_id);
        if (!isValid) {
            return CreateResponse({ data: { msg: "Invalid user" }, res, statusCode: 400 });
        }
        if (seller_id !== req.user._id) {
            return CreateResponse({ data: { msg: "Unauthorized" }, res, statusCode: 400 });
        }
        const pipeLines = [
            {
                $match: {
                    seller: new mongoose.Types.ObjectId(seller_id)
                }
            },
            {
                $lookup: {
                    from: "adds",
                    localField: "product",
                    foreignField: "_id",
                    as: "product"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "seller",
                    foreignField: "_id",
                    as: "seller"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "buyer",
                    foreignField: "_id",
                    as: "buyer"
                }
            },
            {
                $unwind: "$buyer"
            },
            {
                $unwind: "$seller"
            },
            {
                $unwind: "$product"
            }
        ];
        if (title) {
            pipeLines.push({
                $match: {
                    "product.add_title": {
                        $regex: title, $options: 'i'
                    }
                }
            });
        }
        pipeLines.push({
            $facet: {
                paginatedResults: [
                    { $skip: Number(skip) },
                    { $limit: Number(limit) }
                ],
                totalCount: [
                    { $count: 'count' }
                ]
            },
        });
        const orders = await Order.aggregate(pipeLines);
        const paginatedUsers = orders[0].paginatedResults;
        const totalCount = orders[0].totalCount[0] ? orders[0].totalCount[0].count : 0;
        return CreateResponse({ data: { orders: paginatedUsers, totalDocuments: totalCount }, res, statusCode: 200 });
    }
    catch (error) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 });
    }
};
export const get_buyer_orders = async (req, res) => {
    try {
        let { limit, page, title, start_date, end_date } = req.query;
        page = page ?? 1;
        limit = limit ?? 5;
        const skip = (page - 1) * limit;
        const { buyer_id } = req.params;
        const isValid = isValidMongooseId(buyer_id);
        if (!isValid) {
            return CreateResponse({ data: { msg: "Invalid user" }, res, statusCode: 400 });
        }
        if (buyer_id !== req.user._id) {
            return CreateResponse({ data: { msg: "Unauthorized" }, res, statusCode: 400 });
        }
        const pipeLines = [
            {
                $match: {
                    buyer: new mongoose.Types.ObjectId(buyer_id)
                }
            },
            {
                $lookup: {
                    from: "adds",
                    localField: "product",
                    foreignField: "_id",
                    as: "product"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "seller",
                    foreignField: "_id",
                    as: "seller"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "buyer",
                    foreignField: "_id",
                    as: "buyer"
                }
            },
            {
                $unwind: "$buyer"
            },
            {
                $unwind: "$seller"
            },
            {
                $unwind: "$product"
            },
        ];
        if (title) {
            pipeLines.push({
                $match: {
                    "product.add_title": {
                        $regex: title, $options: 'i'
                    }
                }
            });
        }
        if (start_date && end_date) {
            pipeLines.push({
                $match: {
                    createdAt: {
                        $gte: new Date(start_date),
                        $lte: new Date(end_date)
                    }
                }
            });
        }
        pipeLines.push({
            $facet: {
                paginatedResults: [
                    { $skip: Number(skip) },
                    { $limit: Number(limit) }
                ],
                totalCount: [
                    { $count: 'count' }
                ]
            },
        });
        const orders = await Order.aggregate(pipeLines);
        const paginatedUsers = orders[0].paginatedResults;
        const totalCount = orders[0].totalCount[0] ? orders[0].totalCount[0].count : 0;
        return CreateResponse({ data: { orders: paginatedUsers, totalDocuments: totalCount }, res, statusCode: 200 });
    }
    catch (error) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 });
    }
};
export const change_order_process_status = async (req, res) => {
    try {
        const uid = req.user._id;
        const body = await change_order_process_status_validator.validate(req.body);
        const dbOrder = await Order.findById(body.order_id);
        if (!dbOrder) {
            return CreateResponse({ data: { msg: 'Order not found' }, res, statusCode: 400 });
        }
        if (uid !== String(dbOrder.seller)) {
            return CreateResponse({ data: { msg: 'Unauthorized' }, res, statusCode: 400 });
        }
        // check if the status date already exists.
        const alreadyExists = dbOrder.process_status.find((status) => status.status === body.process_status);
        if (alreadyExists && alreadyExists.date) {
            return CreateResponse({ data: { msg: 'Status already updated' }, res, statusCode: 400 });
        }
        // new updated status
        const updated_process_status = dbOrder.process_status.map((val) => val.status === body.process_status ? ({ status: val.status, date: new Date() }) : val);
        console.log(updated_process_status);
        const updated_order = await Order.findByIdAndUpdate(body.order_id, {
            $set: {
                process_status: updated_process_status
            }
        }, {
            new: true
        })
            .populate("product")
            .populate("seller", "-password")
            .populate("buyer", "-password");
        return CreateResponse({ data: { updated_order }, res, statusCode: 200 });
    }
    catch (error) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 });
    }
};
export const seller_subscriptions_orders = async (req, res) => {
    try {
        let { limit, page, start_date, end_date, subscription } = req.query;
        page = page ?? 1;
        limit = limit ?? 5;
        const skip = (page - 1) * limit;
        const uid = req.user._id;
        const pipeLines = [
            {
                $match: {
                    seller: new mongoose.Types.ObjectId(uid)
                }
            },
            {
                $lookup: {
                    from: "adds",
                    localField: "product",
                    as: "product",
                    foreignField: "_id"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "buyer",
                    as: "buyer",
                    foreignField: "_id",
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "seller",
                    as: "seller",
                    foreignField: "_id"
                }
            },
            {
                $unwind: "$product"
            },
            {
                $match: {
                    'product.plan': {
                        $exists: true
                    }
                }
            },
        ];
        // filtration
        if (start_date && end_date) {
            pipeLines.push({
                $match: {
                    createdAt: {
                        $gte: new Date(start_date),
                        $lte: new Date(end_date)
                    }
                }
            });
        }
        if (subscription) {
            pipeLines.push({
                $match: {
                    'product.plan.name': subscription
                }
            });
        }
        // filtration
        // REMEMBER: $facet must be at the end of stages.
        pipeLines.push({
            $facet: {
                paginatedResult: [
                    {
                        $skip: Number(skip),
                    },
                    {
                        $limit: Number(limit)
                    }
                ],
                totalCount: [
                    {
                        $count: 'count'
                    }
                ]
            }
        });
        const results = await Order.aggregate(pipeLines);
        console.log(results);
        const confirmed_invoices_pipeline = [
            {
                $match: {
                    seller: new mongoose.Types.ObjectId(uid),
                    payment_status: PAYMENT_STATUS_ENUM.PAID
                }
            },
            {
                $lookup: {
                    from: "adds",
                    localField: "product",
                    as: "product",
                    foreignField: "_id"
                }
            },
            {
                $unwind: "$product"
            },
            {
                $match: {
                    'product.plan': {
                        $exists: true
                    }
                }
            },
            {
                $facet: {
                    totalCount: [
                        {
                            $count: 'count'
                        }
                    ]
                }
            }
        ];
        const orders = results[0].paginatedResult;
        const confirmed_invoices = await Order.aggregate(confirmed_invoices_pipeline);
        const totalDocuments = results[0].totalCount[0]?.count || 0;
        return CreateResponse({
            data: {
                orders,
                totalDocuments,
                confirmed_invoices: confirmed_invoices[0].totalCount[0]?.count || 0
            }, res, statusCode: 200
        });
    }
    catch (error) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 });
    }
};
export const buyer_invoices = async (req, res) => {
    try {
        let { limit, page, end_date, start_date } = req.query;
        page = page ?? 1;
        limit = limit ?? 5;
        let query = { buyer: req.user._id };
        if (start_date && end_date) {
            query['createdAt'] = {
                $gte: new Date(start_date),
                $lte: new Date(end_date)
            };
        }
        const skip = (page - 1) * limit;
        const invoices = await Order.find(query).limit(limit).skip(skip).populate("buyer", "-password").populate("seller", '-password').populate("product");
        const totalDocuments = await Order.count(query);
        return CreateResponse({ data: { orders: invoices, totalDocuments }, res, statusCode: 200 });
    }
    catch (error) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 });
    }
};
export const get_buyer_analytics = async (req, res) => {
    try {
        const total_orders = await Order.count({ buyer: req.user._id });
        // TODO: get data from stripe
        const total_spend = 0;
        // last seven days 3 orders.
        let last_seven_date = new Date();
        last_seven_date.setDate(last_seven_date.getDate() - 7);
        const orders = await Order.find({
            buyer: req.user._id,
            createdAt: {
                $gte: new Date(last_seven_date),
                $lte: new Date()
            }
        }).limit(3).sort("-createdAt");
        return CreateResponse({ data: { total_orders, total_spend, orders }, res, statusCode: 200 });
    }
    catch (error) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 });
    }
};
//# sourceMappingURL=order.user.controller.js.map