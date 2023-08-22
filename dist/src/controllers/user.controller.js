import { CreateResponse } from "../utils/user/CreateResponse.js";
import User, { ACCOUNT_STATUS_ENUM } from "../models/User.model.js";
import { isValidMongooseId } from "../utils/isValidMongooseId.js";
import Order from "../models/Order.js";
import Add from "../models/Add.model.js";
import { ORDER_PROCESS_STATUS_ENUM, ORDER_STATUS_ENUM } from "../utils/enums.js";
export const getUserProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const isValidId = isValidMongooseId(id);
        if (!isValidId) {
            return CreateResponse({ data: { msg: 'User not found' }, res, statusCode: 400 });
        }
        const dbUser = await User.findById(id).select("-password -otp -otp_expiry_time -resetToken");
        if (!dbUser) {
            return CreateResponse({ data: { msg: 'User not found' }, res, statusCode: 400 });
        }
        return CreateResponse({ data: dbUser, res, statusCode: 200 });
    }
    catch (error) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 });
    }
};
export const getSellersWithFiltration = async (req, res) => {
    try {
        let { limit, page } = req.query;
        page = Number(page ?? 1);
        limit = Number(limit ?? 5);
        const skip = (page - 1) * limit;
        const pipeline = [
            {
                $lookup: {
                    from: 'adds',
                    localField: '_id',
                    foreignField: 'created_by',
                    as: 'products',
                },
            },
            {
                $match: {
                    products: { $gt: [] }, // Filter users with at least one product
                },
            },
            {
                $addFields: {
                    latestProduct: {
                        $arrayElemAt: ['$products', -1] // Get the last element in the products array (latest product)
                    },
                },
            },
            {
                $project: {
                    _id: 1,
                    email: 1,
                    profile_image: 1,
                    varified: 1,
                    phoneNumber: 1,
                    fullName: 1,
                    username: 1,
                    latestProduct: 1,
                    createdAt: 1
                },
            },
            {
                $facet: {
                    paginatedResults: [
                        { $skip: skip },
                        { $limit: limit }
                    ],
                    totalCount: [
                        { $count: 'count' }
                    ]
                },
            },
        ];
        const results = await User.aggregate(pipeline);
        const paginatedUsers = results[0].paginatedResults;
        const totalCount = results[0].totalCount[0] ? results[0].totalCount[0].count : 0;
        return CreateResponse({ data: { users: paginatedUsers, totalDocuments: totalCount }, res, statusCode: 200 });
    }
    catch (error) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 });
    }
};
export const getBuyerWithFiltration = async (req, res) => {
    try {
        let { limit, page } = req.query;
        page = Number(page ?? 1);
        limit = Number(limit ?? 5);
        const skip = (page - 1) * limit;
        const pipeline = [
            {
                $lookup: {
                    from: 'orders',
                    localField: '_id',
                    foreignField: 'buyer',
                    as: 'products',
                },
            },
            {
                $match: {
                    products: { $gt: [] }, // Filter users with at least one product
                },
            },
            {
                $addFields: {
                    latestProduct: {
                        $arrayElemAt: ['$products', -1] // Get the last element in the products array (latest product)
                    },
                },
            },
            {
                $lookup: {
                    from: 'adds',
                    localField: 'latestProduct.product',
                    foreignField: '_id',
                    as: 'latestProduct.product',
                },
            },
            {
                $project: {
                    _id: 1,
                    email: 1,
                    profile_image: 1,
                    varified: 1,
                    phoneNumber: 1,
                    fullName: 1,
                    username: 1,
                    latestProduct: 1,
                    createdAt: 1
                },
            },
            {
                $facet: {
                    paginatedResults: [
                        { $skip: skip },
                        { $limit: limit }
                    ],
                    totalCount: [
                        { $count: 'count' }
                    ]
                },
            },
        ];
        const results = await User.aggregate(pipeline);
        const paginatedUsers = results[0].paginatedResults;
        const totalCount = results[0].totalCount[0] ? results[0].totalCount[0].count : 0;
        return CreateResponse({ data: { users: paginatedUsers, totalDocuments: totalCount }, res, statusCode: 200 });
    }
    catch (error) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 });
    }
};
export const getSingleUserAllOrdersFiltration = async (req, res) => {
    try {
        // FILTERS.
        let { limit, page } = req.query;
        page = page ?? 1;
        limit = limit ?? 5;
        const skip = (page - 1) * limit;
        // PARAMS USER ID.
        const { uid } = req.params;
        const validId = isValidMongooseId(uid);
        if (!validId) {
            return CreateResponse({ data: { msg: 'Invalid ID' }, res, statusCode: 400 });
        }
        const orders = await Order.find({ buyer: uid }, {}, { skip, limit }).populate("buyer", "-password").populate("product");
        const totalDocuments = await Order.count({ buyer: uid });
        return CreateResponse({ data: { orders, totalDocuments }, res, statusCode: 200 });
    }
    catch (error) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 });
    }
};
export const get_dashboard_analytics = async (req, res) => {
    try {
        const unique_sellers = await Order.aggregate([
            {
                $group: {
                    _id: '$seller',
                }
            },
            {
                $group: {
                    _id: null,
                    totalUniqueSellers: { $sum: 1 }
                }
            }
        ]);
        const unique_buyers = await Order.aggregate([
            {
                $group: {
                    _id: '$buyer',
                }
            },
            {
                $group: {
                    _id: null,
                    totalUniqueBuyers: { $sum: 1 }
                }
            }
        ]);
        const activate_accounts = await User.count({ account_status: ACCOUNT_STATUS_ENUM.ACTIVATED });
        const deactivate_accounts = await User.count({ account_status: ACCOUNT_STATUS_ENUM.DEACTIVATED });
        const total_products = await Add.count({});
        const published_products = await Add.count({ disabled: false });
        const unpublished_products = await Add.count({ disabled: true });
        const pending_orders = await Order.count({ order_status: ORDER_STATUS_ENUM.PENDING, 'process_status.status': ORDER_PROCESS_STATUS_ENUM.ORDERED });
        const active_orders = await Order.count({ order_status: ORDER_STATUS_ENUM.PENDING, 'process_status.status': ORDER_PROCESS_STATUS_ENUM.DELIVERED });
        const completed_orders = await Order.count({ order_status: ORDER_STATUS_ENUM.COMPLETED });
        const cancelled_orders = await Order.count({ order_status: { '$in': [ORDER_STATUS_ENUM.CANCELLED, ORDER_STATUS_ENUM.REJECTED] } });
        // TODO: get total transactions detail from strip
        const total_transactions = 0;
        // TODO: get my earnings detail from strip
        const my_earnings = 0;
        const to_return = {
            seller_accounts: unique_sellers.length > 0 ? unique_sellers[0].totalUniqueSellers : 0,
            buyer_accounts: unique_buyers.length > 0 ? unique_buyers[0].totalUniqueBuyers : 0,
            activate_accounts,
            deactivate_accounts,
            total_products,
            published_products,
            unpublished_products,
            pending_orders,
            active_orders,
            completed_orders,
            cancelled_orders,
            total_transactions,
            my_earnings
        };
        return CreateResponse({ data: to_return, res, statusCode: 200 });
    }
    catch (error) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 });
    }
};
//# sourceMappingURL=user.controller.js.map