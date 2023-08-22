import jwt from 'jsonwebtoken';
export const createAccessToken = (data) => {
    return jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "90d" });
};
//# sourceMappingURL=createAccessToken.js.map