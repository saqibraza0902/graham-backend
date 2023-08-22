import { Request, Response } from "express"
import { CreateResponse } from "../../utils/user/CreateResponse.js"
import Category from "../../models/Category.js"
import { isValidMongooseId } from "../../utils/isValidMongooseId.js"

export const getUserParentCategories = async (req: Request, res: Response) => {
    try {
        const categories = await Category.find({ parent_category: null, draft: false })
        return CreateResponse({ data: categories, res, statusCode: 200 })
    } catch (error: any) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 })
    }
}
export const getUserSubCategoriesOfParentCategories = async (req: Request, res: Response) => {
    try {
        let { id } = req.params as { id: string }
        const isValid = isValidMongooseId(id)
        if (!isValid) {
            const dbCat = await Category.findOne({ name: id })
            id = String(dbCat._id)
        }
        const subCategories = await Category.find({ parent_category: id, draft: false })
        return CreateResponse({ data: subCategories, res, statusCode: 200 })
    } catch (error: any) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 })
    }
}
