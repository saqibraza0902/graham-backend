import { IUser } from "../../models/User.model.js"

type Data = Pick<IUser, 'email' | 'country' | 'phoneNumber' | 'role' | 'city' | 'fullName' | 'state' | 'username' | 'zip_code' | 'profile_image'> & { _id: string }
export const createReturnUser = (data: Data) => {
    return data;
}