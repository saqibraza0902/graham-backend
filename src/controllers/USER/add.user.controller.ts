import { Request, Response, query } from "express"
import { CreateResponse } from "../../utils/user/CreateResponse.js"
import { createAddValidator } from "../../validators/add.validators.js"
import Add from "../../models/Add.model.js"
import { UploadImage } from "../../lib/imageUpload.js"
import LikedProduct from "../../models/LikeProduct.model.js"
import { isValidMongooseId } from "../../utils/isValidMongooseId.js"

export const createAdd = async (req: Request, res: Response) => {
    try {

        let body = await createAddValidator.validate(req.body)
        body.end_date = new Date(body.end_date) as any
        body.start_date = new Date(body.start_date) as any
        let cloudImage: string[] = []
        for (let index = 0; index < body.images.length; index++) {
            const url = await UploadImage(body.images[index])
            cloudImage.push(url.secure_url)
        }
        // @ts-ignore
        body.location.coordinates = [parseFloat(body.location.long), parseFloat(body.location.lat)]
        const add = await Add.create({ ...body, created_by: req.user._id, images: cloudImage })
        return CreateResponse({ data: add, res, statusCode: 200 })
    } catch (error: any) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 })
    }
}

export const deleteAdd = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string }
        const dbAdd = await Add.findById(id)
        if (!dbAdd) {
            return CreateResponse({ data: { msg: 'Add not found.' }, res, statusCode: 200 })
        }
        if (String(dbAdd.created_by) !== req.user._id) {
            return CreateResponse({ data: { msg: 'Unauthorized.' }, res, statusCode: 400 })
        }
        await Add.findOneAndDelete({ _id: id })
        return CreateResponse({ data: { msg: 'success' }, res, statusCode: 200 })
    } catch (error: any) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 })
    }
}

export const updateAdd = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string }
        const dbAdd = await Add.findById(id)
        if (String(dbAdd.created_by) !== req.user._id) {
            return CreateResponse({ data: { msg: 'Unauthorized.' }, res, statusCode: 400 })
        }
        let body = await createAddValidator.validate(req.body)
        body.end_date = new Date(body.end_date) as any
        body.start_date = new Date(body.start_date) as any
        // for (let index = 0; index < body.images.length; index++) {

        // }
        await Add.findByIdAndUpdate(id, {
            $set: {
                ...body
            }
        })
        return CreateResponse({ data: { msg: 'success' }, res, statusCode: 200 })
    } catch (error: any) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 })
    }
}


export const getAllAdds = async (req: Request, res: Response) => {
    try {
        const adds = await Add.find()
        return CreateResponse({ data: adds, res, statusCode: 200 })
    } catch (error) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 })
    }
}

export const getSingleAdd = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string }
        const dbAdd = await Add.findById(id).populate("created_by", '-password')
        if (!dbAdd) {
            return CreateResponse({ data: { msg: 'Add not found.' }, res, statusCode: 500 })
        }
        return CreateResponse({ data: dbAdd, res, statusCode: 200 })
    } catch (error) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 })
    }
}

export const getSingleAddForDescriptionPage = async (req: Request, res: Response) => {
    try {

        const { id } = req.params as { id: string }
        const dbAdd = await Add.findById(id).populate("created_by", '-password')
        if (!dbAdd) {
            return CreateResponse({ data: { msg: 'Add not found.' }, res, statusCode: 500 })
        }
        let liked = false
        if (req.user._id) {

        }
        return CreateResponse({ data: dbAdd, res, statusCode: 200 })
    } catch (error) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 })
    }
}

type SearchAddsQuery = {
    lat?: string
    long?: string
    kilometers?: number
    category?: string
    searchText?: string
    brand?: string[]
    min_price?: string
    max_price?: string
    sub_category?: string
    page?: string
    limit?: string
    city?: string
}
const buildSearchAddsQuery = (queries: SearchAddsQuery) => {
    if (!queries) {
        return {}
    }
    let searchQuery = {}
    // GEO LOCATION, TO FIND THE NEAREST LOCATION. ([LNG,LAT])
    if (queries && queries.lat && queries.long && queries.kilometers) {
        searchQuery["location"] = {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [parseFloat(queries.long), parseFloat(queries.lat)]
                },
                $maxDistance: Number(queries.kilometers) * 1000
            }
        }
    }
    // CATEGORY FILTRATION.
    if (queries && queries.category) {
        searchQuery["category"] = queries.category
    }
    // TITLE SEARCH FILTRATION.
    if (queries && queries.searchText) {
        searchQuery["add_title"] = { $regex: queries.searchText, $options: 'i' }
    }
    // BRAND ARRAY FILTRATION.
    if (queries && queries.brand.length) {
        searchQuery["brand"] = { "$in": queries.brand }
    }
    // PRICE FILTRATION.
    if (queries && queries.min_price && queries.max_price) {
        searchQuery["prices.rent_price"] = {
            $gte: parseFloat(queries.min_price),
            $lte: parseFloat(queries.max_price)
        }
    }
    // SUB-CATEGORY FILTER
    if (queries && queries.sub_category) {
        searchQuery['sub_category'] = queries.sub_category
    }
    // CITY FILTER
    if (queries && queries.city) {
        searchQuery['location.city'] = queries.city
    }
    // SEARCH THE ADDS WITH AVAILABLE_STOCK AT LEAST 1.
    searchQuery['available_stock'] = { "$gt": 0 }

    return searchQuery;
}
export const searchAdds = async (req: Request, res: Response) => {
    try {
        const queries = req.body as SearchAddsQuery

        const searchQuery = Object.keys(queries).length ? buildSearchAddsQuery(queries) : {}

        let limit = Number(queries.limit) || 9
        let page = Number(queries.page) || 1
        let skip = limit * (page - 1)
        let options = {
            limit,
            skip,
        }
        let products = await Add.find(searchQuery, {}, options)
        const totalAdds = await Add.count(searchQuery)
        if (req?.user?._id) {
            for (let index = 0; index < products.length; index++) {
                const liked = await LikedProduct.findOne({ add_id: products[index]._id, user_id: req.user._id })

                if (liked) {
                    products[index] = {
                        // @ts-ignore
                        ...products[index]._doc,
                        liked: true
                    }
                } else {
                    products[index] = {
                        // @ts-ignore
                        ...products[index]._doc,
                        liked: false
                    }
                }
            }
        }
        return CreateResponse({ data: { totalAdds, products }, res, statusCode: 200 })
    } catch (error: any) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 })
    }
}


export const disableAdd = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as {
            id: string
        }

        const dbAdd = await Add.findById(id)
        if (!dbAdd) {
            return CreateResponse({ data: { msg: 'Product not found.' }, res, statusCode: 400 })
        }
        if (String(dbAdd.created_by) !== req.user._id) {
            return CreateResponse({ data: { msg: 'Unauthorized.' }, res, statusCode: 400 })
        }
        await Add.findByIdAndUpdate(id, {
            $set: {
                disabled: true
            }
        })
        return CreateResponse({ data: { msg: 'success.' }, res, statusCode: 200 })
    } catch (error: any) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 })
    }
}
export const unableAdd = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as {
            id: string
        }

        const dbAdd = await Add.findById(id)
        if (!dbAdd) {
            return CreateResponse({ data: { msg: 'Product not found.' }, res, statusCode: 400 })
        }
        if (String(dbAdd.created_by) !== req.user._id) {
            return CreateResponse({ data: { msg: 'Unauthorized.' }, res, statusCode: 400 })
        }
        await Add.findByIdAndUpdate(id, {
            $set: {
                disabled: false
            }
        })
        return CreateResponse({ data: { msg: 'success.' }, res, statusCode: 200 })
    } catch (error: any) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 })
    }
}


export const getDescriptionPageAddWithDetails = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string }
        const isValidId = isValidMongooseId(id)
        if (!isValidId) {
            return CreateResponse({ data: { msg: 'Invalid product' }, res, statusCode: 400 })
        }
        const dbAdd = await Add.findById(id).populate("created_by", '-password')
        if (!dbAdd) {
            return CreateResponse({ data: { msg: 'Add not found.' }, res, statusCode: 500 })
        }
        let liked = false
        if (req?.user?._id) {
            const isLiked = await LikedProduct.findOne({ add_id: dbAdd._id, user_id: req.user._id })
            if (isLiked) {
                liked = true
            }
        }
        const totalCreatedProducts = await Add.count({ created_by: dbAdd.created_by })
        // GET SUGGESTED PRODUCT BASED ON CATEGORIES OR SUBCATEGORIES
        let suggestedProducts = await Add.find({ category: dbAdd.category }, {}, { limit: 4 })
        if (suggestedProducts.length === 0) {
            suggestedProducts = await Add.find({ _id: { $nin: [dbAdd._id] } }, {}, { limit: 4 })
        }
        if (req?.user?._id) {
            for (let index = 0; index < suggestedProducts.length; index++) {
                const liked = await LikedProduct.findOne({ add_id: suggestedProducts[index]._id, user_id: req.user._id })

                if (liked) {
                    suggestedProducts[index] = {
                        // @ts-ignore
                        ...suggestedProducts[index]._doc,
                        liked: true
                    }
                } else {
                    suggestedProducts[index] = {
                        // @ts-ignore
                        ...suggestedProducts[index]._doc,
                        liked: false
                    }
                }
            }
        }
        return CreateResponse({ data: { add: dbAdd, liked, totalCreatedProducts, suggestedProducts }, res, statusCode: 200 })
    } catch (error) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 })
    }
}