import jwt from 'jsonwebtoken'
import { SessionUser } from '../../types/index.js'


export const createAccessToken = (data: SessionUser) => {
    return jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "90d" })
}
