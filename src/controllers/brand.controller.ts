import { Request, Response } from "express"
import { CreateResponse } from "../utils/user/CreateResponse.js"
import Brand from "../models/Brand.model.js"
import { updateBrandValidator } from "../validators/brand.validators.js"
import { isValidMongooseId } from "../utils/isValidMongooseId.js"

export const createBrand = async (req: Request, res: Response) => {
    try {
        const { name, draft } = await updateBrandValidator.validate(req.body)
        if (!name) {
            return CreateResponse({ data: { msg: 'Name is required.' }, res, statusCode: 400 })
        }
        const dbBrand = await Brand.findOne({ name })
        if (dbBrand) {
            return CreateResponse({ data: { msg: 'Brand name already exists.' }, res, statusCode: 400 })
        }
        const brand = await Brand.create({
            name,
            draft,
        })
        return CreateResponse({ data: brand, res, statusCode: 200 })
    } catch (error: any) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 })
    }
}


export const getAllBrands = async (req: Request, res: Response) => {
    try {
        const brands = await Brand.find({})
        return CreateResponse({ data: brands, res, statusCode: 200 })
    } catch (error: any) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 })
    }
}

export const getAllBrandsWithFiltration = async (req: Request, res: Response) => {
    try {
        let { limit, page } = req.query as unknown as {
            page: number,
            limit: number
        }
        page = page ?? 1
        limit = limit ?? 5
        const skip = (page - 1) * limit
        const brands = await Brand.find({}, {}, { limit, skip })
        const totalDocuments = await Brand.count({})
        return CreateResponse({ data: { brands, totalDocuments }, res, statusCode: 200 })
    } catch (error: any) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 })
    }
}

export const deleteBrand = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string }
        await Brand.findOneAndDelete({ _id: id })
        return CreateResponse({ data: { msg: "success" }, res, statusCode: 200 })
    } catch (error: any) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 })
    }
}

export const updateBrand = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string }
        const body = await updateBrandValidator.validate(req.body)
        const updated = await Brand.findOneAndUpdate({ _id: id }, {
            $set: {
                ...body,
            }
        }, {
            new: true
        })
        return CreateResponse({ data: updated, res, statusCode: 200 })
    } catch (error: any) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 })
    }
}
export const getSingleBrand = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string }
        const isValidID = isValidMongooseId(id)
        if (!isValidID) {
            return CreateResponse({ data: { msg: "Invalid ID" }, res, statusCode: 200 })
        }
        const dbBrand = await Brand.findById(id)
        if (!dbBrand) {
            return CreateResponse({ data: { msg: "Brand not found" }, res, statusCode: 200 })
        }
        return CreateResponse({ data: dbBrand, res, statusCode: 200 })
    } catch (error: any) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 })
    }
}

