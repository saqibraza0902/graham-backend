import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import Admin, { ADMIN_TYPES } from "../models/Admin.model.js";
export const requireSignInMiddleware = async (req, res, next) => {
    try {
        let token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ msg: "Unauthorized" });
        }
        token = req.headers.authorization.split(" ")[1];
        const user = await verifyToken(token);
        if (user) {
            const dbUser = await User.findOne({ _id: user._id });
            if (!dbUser) {
                return res.status(401).json({ msg: "Unauthorized" });
            }
            if (!dbUser.varified) {
                return res.status(401).json({ msg: "Unauthorized" });
            }
            req.user = {
                _id: String(dbUser._id)
            };
            next();
        }
        else {
            return res.status(401).json({ msg: "Unauthorized" });
        }
    }
    catch (error) {
        console.error("Error in requireSignInMiddleware:", error);
        return res.status(500).json({ msg: error.message });
    }
};
const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(user);
            }
        });
    });
};
export const attachTokenUserId = async (req, res, next) => {
    try {
        let token = req.headers.authorization;
        if (!token) {
            next();
        }
        else {
            token = req.headers.authorization.split(" ")[1];
            const user = await verifyToken(token);
            if (user) {
                const dbUser = await User.findOne({ _id: user._id });
                if (!dbUser) {
                    next();
                }
                else {
                    req.user = { _id: String(dbUser._id) };
                    next();
                }
            }
        }
    }
    catch (error) {
        next();
    }
};
export const requireAdminSignInMiddleware = async (req, res, next) => {
    try {
        let token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ msg: "Unauthorized" });
        }
        token = req.headers.authorization.split(" ")[1];
        const user = await verifyToken(token);
        if (user) {
            const dbUser = await Admin.findOne({ _id: user._id });
            if (!dbUser) {
                return res.status(401).json({ msg: "Unauthorized" });
            }
            if (!dbUser.role.includes(ADMIN_TYPES.ADMIN)) {
                return res.status(401).json({ msg: "Unauthorized" });
            }
            req.user = {
                _id: String(dbUser._id)
            };
            next();
        }
        else {
            return res.status(401).json({ msg: "Unauthorized" });
        }
    }
    catch (error) {
        console.error("Error in requireSignInMiddleware:", error);
        return res.status(500).json({ msg: error.message });
    }
};
//# sourceMappingURL=index.js.map