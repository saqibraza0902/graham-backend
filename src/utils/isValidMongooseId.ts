import { isValidObjectId } from "mongoose";

export const isValidMongooseId = (id: string) => {
    return isValidObjectId(id)
}