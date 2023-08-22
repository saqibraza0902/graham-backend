import { CreateResponse } from "../../utils/user/CreateResponse.js";
import Brand from "../../models/Brand.model.js";
export const getAllUserBrands = async (req, res) => {
    try {
        const brands = await Brand.find({ draft: false });
        return CreateResponse({ data: brands, res, statusCode: 200 });
    }
    catch (error) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 });
    }
};
//# sourceMappingURL=brand.user.controller.js.map