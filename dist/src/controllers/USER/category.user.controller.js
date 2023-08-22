import { CreateResponse } from "../../utils/user/CreateResponse.js";
import Category from "../../models/Category.js";
import { isValidMongooseId } from "../../utils/isValidMongooseId.js";
export const getUserParentCategories = async (req, res) => {
    try {
        const categories = await Category.find({ parent_category: null, draft: false });
        return CreateResponse({ data: categories, res, statusCode: 200 });
    }
    catch (error) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 });
    }
};
export const getUserSubCategoriesOfParentCategories = async (req, res) => {
    try {
        let { id } = req.params;
        const isValid = isValidMongooseId(id);
        if (!isValid) {
            const dbCat = await Category.findOne({ name: id });
            id = String(dbCat._id);
        }
        const subCategories = await Category.find({ parent_category: id, draft: false });
        return CreateResponse({ data: subCategories, res, statusCode: 200 });
    }
    catch (error) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 });
    }
};
//# sourceMappingURL=category.user.controller.js.map