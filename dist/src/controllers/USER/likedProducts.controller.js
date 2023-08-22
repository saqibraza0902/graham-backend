import { CreateResponse } from "../../utils/user/CreateResponse.js";
import { likeProductValidator } from "../../validators/likeproduct.validator.js";
import LikedProduct from "../../models/LikeProduct.model.js";
import Add from "../../models/Add.model.js";
import { isValidMongooseId } from "../../utils/isValidMongooseId.js";
export const likeProduct = async (req, res) => {
    try {
        const { add_id } = await likeProductValidator.validate(req.body);
        const isValidID = isValidMongooseId(add_id);
        if (!isValidID) {
            return CreateResponse({ data: { msg: 'Product not found, try again later.' }, res, statusCode: 400 });
        }
        const dbAdd = await Add.findById(add_id);
        if (!dbAdd) {
            return CreateResponse({ data: { msg: 'Product not found, try again later.' }, res, statusCode: 400 });
        }
        await LikedProduct.findOneAndUpdate({ add_id, user_id: req.user._id }, {}, { upsert: true });
        return CreateResponse({ data: { msg: 'success' }, res, statusCode: 200 });
    }
    catch (error) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 });
    }
};
export const unlikeProduct = async (req, res) => {
    try {
        const { add_id } = await likeProductValidator.validate(req.body);
        const isValidID = isValidMongooseId(add_id);
        if (!isValidID) {
            return CreateResponse({ data: { msg: 'Product not found, try again later.' }, res, statusCode: 400 });
        }
        const dbAdd = await Add.findById(add_id);
        if (!dbAdd) {
            return CreateResponse({ data: { msg: 'Product not found, try again later.' }, res, statusCode: 400 });
        }
        const isAlreadyLiked = await LikedProduct.findOne({ add_id, user_id: req.user._id });
        if (isAlreadyLiked) {
            await LikedProduct.findOneAndDelete({ add_id, user_id: req.user._id });
        }
        return CreateResponse({ data: { msg: 'success' }, res, statusCode: 200 });
    }
    catch (error) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 });
    }
};
//# sourceMappingURL=likedProducts.controller.js.map