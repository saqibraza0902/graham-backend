import { Request, Response } from "express";
import Order from "../../models/Order.js";
import { ORDER_STATUS_ENUM, PAYMENT_STATUS_ENUM } from "../../utils/enums.js";
import Add from "../../models/Add.model.js";
import { CreateResponse } from "../../utils/user/CreateResponse.js";
import mongoose from "mongoose";
import { stripe } from "../../lib/stripe.js";
import User from "../../models/User.model.js";
import BankAccount from "../../models/BankAccount.model.js";

export const seller_account_analytics = async (req: Request, res: Response) => {
    try {
        const uid = new mongoose.Types.ObjectId(req.user._id)
        // TODO: GET DATA FROM USER STRIPE ACCOUNT
        const total_earnings = 0

        const total_orders = await Order.count({ seller: uid })
        const total_completed_orders = await Order.count({ seller: uid, order_status: ORDER_STATUS_ENUM.COMPLETED })
        const total_products = await Add.count({ created_by: uid })
        const published_properties = await Add.count({ created_by: uid, disabled: false })
        const un_published_properties = await Add.count({ created_by: uid, disabled: true })
        return CreateResponse({
            data: {
                total_orders,
                total_completed_orders,
                total_products,
                published_properties,
                un_published_properties,
                total_earnings
            }, res, statusCode: 200
        })
    } catch (error: any) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 })
    }
}


export const create_user_onboarding_account = async (req: Request, res: Response) => {
    try {
        const uid = req.user._id
        const account = await stripe.accounts.create({ type: "express", metadata:{user_acount:"user_account"} });
        const newBankAccount = await BankAccount.create({
            account_id: account.id,
            user: uid,
        })
        const accountLink = await stripe.accountLinks.create({
            account: newBankAccount.account_id,
            return_url: `${process.env.STRIPE_CONNECT_SUCCESS}?account=${newBankAccount._id}`,
            refresh_url: `${process.env.STRIPE_CONNECT_REFRESH}?account=${newBankAccount._id}`,
            type: "account_onboarding",

        });
        const params = new URLSearchParams();

        for (const [key, value] of Object.entries(accountLink)) {
            params.append(key, value);
        }

        const searchParamsString = params.toString();

        const url = `${accountLink.url}?${searchParamsString}`;
        return CreateResponse({ data: url, res, statusCode: 200 })
    } catch (error) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 })
    }
}