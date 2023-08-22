import { Request, Response } from "express"
import { CreateResponse } from "../utils/user/CreateResponse.js"
import { createTaxValidator, updateTaxValidator } from "../validators/tax.validators.js"
import Tax from "../models/Tax.model.js"
import { isValidMongooseId } from "../utils/isValidMongooseId.js"

export const createTax = async (req: Request, res: Response) => {
    try {
        const body = await createTaxValidator.validate(req.body)
        const dbTax = await Tax.findOne({ name: body.name })
        if (dbTax) {
            return CreateResponse({ data: { msg: 'Tax name already exists.' }, res, statusCode: 400 })
        }
        const newTax = await Tax.create(body)
        return CreateResponse({ data: newTax, res, statusCode: 200 })
    } catch (error: any) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 })
    }
}

export const deleteTax = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string }
        await Tax.findOneAndDelete({ _id: id })

        return CreateResponse({ data: { msg: "success" }, res, statusCode: 200 })
    } catch (error: any) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 })
    }
}

export const getAllTaxes = async (req: Request, res: Response) => {
    try {
        const taxes = await Tax.find({})
        return CreateResponse({ data: taxes, res, statusCode: 200 })
    } catch (error: any) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 })
    }
}
export const getAllTaxesWithFiltration = async (req: Request, res: Response) => {
    try {
        let { limit, page } = req.query as unknown as {
            page: number,
            limit: number
        }
        page = page ?? 1
        limit = limit ?? 5
        const skip = (page - 1) * limit
        const taxes = await Tax.find({}, {}, { limit, skip })
        const totalDocuments = await Tax.count({})
        return CreateResponse({ data: { taxes, totalDocuments }, res, statusCode: 200 })
    } catch (error: any) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 })
    }
}
export const updateTax = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as {
            id: string
        }
        const body = await updateTaxValidator.validate(req.body)
        const tax = await Tax.findOneAndUpdate({ _id: id }, {
            $set: {
                ...body
            }
        }, {
            new: true
        })
        return CreateResponse({ data: tax, res, statusCode: 200 })
    } catch (error: any) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 })
    }
}

export const getSingleTax = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string }
        const isValidId = isValidMongooseId(id)
        if (!isValidId) {
            return CreateResponse({ data: { msg: 'Invalid ID' }, res, statusCode: 400 })
        }
        const dbTax = await Tax.findById(id)
        return CreateResponse({ data: dbTax, res, statusCode: 200 })
    } catch (error) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 })
    }
}