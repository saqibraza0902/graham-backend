import { CreateResponse } from "../utils/user/CreateResponse.js";
import Category from "../models/Category.js";
import { createCategoryValidator } from "../validators/category.js";
import { UploadImage } from "../lib/imageUpload.js";
import { isValidMongooseId } from "../utils/isValidMongooseId.js";
export const createCategory = async (req, res) => {
    try {
        const { draft, name, parent_category, icon } = await createCategoryValidator.validate(req.body);
        if (!parent_category && !icon) {
            return CreateResponse({ data: { msg: "Icon is required." }, res, statusCode: 400 });
        }
        const dbCat = await Category.findOne({ name });
        if (dbCat) {
            return CreateResponse({ data: { msg: "Category name is already taken." }, res, statusCode: 400 });
        }
        const obj = {
            name
        };
        if (draft) {
            obj.draft = true;
        }
        if (parent_category) {
            // @ts-ignore
            obj.parent_category = parent_category;
        }
        if (!parent_category) {
            const _icon = await UploadImage(icon);
            obj.icon = _icon.secure_url;
        }
        const category = await Category.create(obj);
        return CreateResponse({ data: category, res, statusCode: 200 });
    }
    catch (error) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 });
    }
};
export const getParentCategories = async (req, res) => {
    try {
        let categories = await Category.find({ parent_category: null });
        for (let index = 0; index < categories.length; index++) {
            const totalSubCategories = await Category.count({ parent_category: categories[index]._id });
            categories[index] = {
                // @ts-ignore
                ...categories[index]._doc,
                subCategories: totalSubCategories
            };
        }
        return CreateResponse({ data: categories, res, statusCode: 200 });
    }
    catch (error) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 });
    }
};
export const getParentCategoriesWithFiltration = async (req, res) => {
    try {
        let { limit, page } = req.query;
        page = page ?? 1;
        limit = limit ?? 5;
        const skip = (page - 1) * limit;
        let categories = await Category.find({ parent_category: null }, {}, { limit, skip });
        const totalDocuments = await Category.count({ parent_category: null });
        for (let index = 0; index < categories.length; index++) {
            const totalSubCategories = await Category.count({ parent_category: categories[index]._id });
            categories[index] = {
                // @ts-ignore
                ...categories[index]._doc,
                subCategories: totalSubCategories
            };
        }
        return CreateResponse({ data: { categories, totalDocuments }, res, statusCode: 200 });
    }
    catch (error) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 });
    }
};
export const getSubCategoriesOfParentCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const subCategories = await Category.find({ parent_category: id }).populate("parent_category");
        return CreateResponse({ data: subCategories, res, statusCode: 200 });
    }
    catch (error) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 });
    }
};
export const getSubCategoriesOfParentCategoryWithFiltration = async (req, res) => {
    try {
        const { id } = req.params;
        let { limit, page } = req.query;
        page = page ?? 1;
        limit = limit ?? 5;
        const skip = (page - 1) * limit;
        const subCategories = await Category.find({ parent_category: id }, {}, { limit, skip }).populate("parent_category");
        const totalDocuments = await Category.count({ parent_category: id });
        return CreateResponse({ data: { subCategories, totalDocuments }, res, statusCode: 200 });
    }
    catch (error) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 });
    }
};
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        await Category.findOneAndDelete({ _id: id });
        return CreateResponse({ data: { msg: "success" }, res, statusCode: 200 });
    }
    catch (error) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 });
    }
};
export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const body = await createCategoryValidator.validate(req.body);
        const obj = {
            ...body
        };
        if (body.icon.startsWith("data")) {
            const newImage = await UploadImage(body.icon);
            obj.icon = newImage.secure_url;
        }
        const cat = await Category.findOneAndUpdate({ _id: id }, {
            $set: {
                ...obj
            }
        }, {
            new: true
        });
        return CreateResponse({ data: cat, res, statusCode: 200 });
    }
    catch (error) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 });
    }
};
export const getSingleCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const isValidID = isValidMongooseId(id);
        if (!isValidID) {
            return CreateResponse({ data: { msg: "Invalid ID" }, res, statusCode: 200 });
        }
        const dbCategory = await Category.findById(id);
        if (!dbCategory) {
            return CreateResponse({ data: { msg: "Category not found" }, res, statusCode: 200 });
        }
        return CreateResponse({ data: dbCategory, res, statusCode: 200 });
    }
    catch (error) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 });
    }
};
//# sourceMappingURL=category.controller.js.map