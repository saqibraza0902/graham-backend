import { Request, Response } from "express"
import { CreateResponse } from "../utils/user/CreateResponse.js"
import Category, { ICategory } from "../models/Category.js"
import { createCategoryValidator, updateCategoryValidator } from "../validators/category.js"
import { UploadImage } from "../lib/imageUpload.js"
import { isValidMongooseId } from "../utils/isValidMongooseId.js"

export const createCategory = async (req: Request, res: Response) => {
    try {

        const { draft, name, parent_category, icon } = await createCategoryValidator.validate(req.body)
        if (!parent_category && !icon) {
            return CreateResponse({ data: { msg: "Icon is required." }, res, statusCode: 400 })
        }
        const dbCat = await Category.findOne({ name })
        if (dbCat) {
            return CreateResponse({ data: { msg: "Category name is already taken." }, res, statusCode: 400 })
        }
        const obj = {
            name
        } as Partial<ICategory>
        if (draft) {
            obj.draft = true
        }
        if (parent_category) {
            // @ts-ignore
            obj.parent_category = parent_category
        }
        if (!parent_category) {
            const _icon = await UploadImage(icon)
            obj.icon = _icon.secure_url
        }
        const category = await Category.create(obj)
        return CreateResponse({ data: category, res, statusCode: 200 })
    } catch (error: any) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 })
    }
}

export const getParentCategories = async (req: Request, res: Response) => {
    try {
        let categories = await Category.find({ parent_category: null })
        for (let index = 0; index < categories.length; index++) {
            const totalSubCategories = await Category.count({ parent_category: categories[index]._id })
            categories[index] = {
                // @ts-ignore
                ...categories[index]._doc,
                subCategories: totalSubCategories
            }
        }
        return CreateResponse({ data: categories, res, statusCode: 200 })
    } catch (error: any) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 })
    }
}
export const getParentCategoriesWithFiltration = async (req: Request, res: Response) => {
    try {
        let { limit, page } = req.query as unknown as {
            page: number,
            limit: number
        }
        page = page ?? 1
        limit = limit ?? 5
        const skip = (page - 1) * limit
        let categories = await Category.find({ parent_category: null }, {}, { limit, skip })
        const totalDocuments = await Category.count({ parent_category: null })
        for (let index = 0; index < categories.length; index++) {
            const totalSubCategories = await Category.count({ parent_category: categories[index]._id })
            categories[index] = {
                // @ts-ignore
                ...categories[index]._doc,
                subCategories: totalSubCategories
            }
        }
        return CreateResponse({ data: { categories, totalDocuments }, res, statusCode: 200 })
    } catch (error: any) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 })
    }
}

export const getSubCategoriesOfParentCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string }
        const subCategories = await Category.find({ parent_category: id }).populate("parent_category")
        return CreateResponse({ data: subCategories, res, statusCode: 200 })
    } catch (error: any) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 })
    }
}
export const getSubCategoriesOfParentCategoryWithFiltration = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string }
        let { limit, page } = req.query as unknown as {
            page: number,
            limit: number
        }
        page = page ?? 1
        limit = limit ?? 5
        const skip = (page - 1) * limit
        const subCategories = await Category.find({ parent_category: id }, {}, { limit, skip }).populate("parent_category")
        const totalDocuments = await Category.count({ parent_category: id })
        return CreateResponse({ data: { subCategories, totalDocuments }, res, statusCode: 200 })
    } catch (error: any) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 })
    }
}


export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string }
        await Category.findOneAndDelete({ _id: id })
        return CreateResponse({ data: { msg: "success" }, res, statusCode: 200 })
    } catch (error: any) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 })
    }
}

export const updateCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string }
        const body = await createCategoryValidator.validate(req.body)
        const obj = {
            ...body
        } as unknown as Partial<ICategory>
        if (body.icon.startsWith("data")) {
            const newImage = await UploadImage(body.icon)
            obj.icon = newImage.secure_url
        }
        const cat = await Category.findOneAndUpdate({ _id: id }, {
            $set: {
                ...obj
            }
        }, {
            new: true
        })
        return CreateResponse({ data: cat, res, statusCode: 200 })
    } catch (error: any) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 })
    }
}
export const getSingleCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string }
        const isValidID = isValidMongooseId(id)
        if (!isValidID) {
            return CreateResponse({ data: { msg: "Invalid ID" }, res, statusCode: 200 })
        }
        const dbCategory = await Category.findById(id)
        if (!dbCategory) {
            return CreateResponse({ data: { msg: "Category not found" }, res, statusCode: 200 })
        }
        return CreateResponse({ data: dbCategory, res, statusCode: 200 })
    } catch (error: any) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 })
    }
}

