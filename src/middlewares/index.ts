import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import { SessionUser } from "../types/index.js";
import Admin, { ADMIN_TYPES } from "../models/Admin.model.js";

export const requireSignInMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        let token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ msg: "Unauthorized" });
        }
        token = req.headers.authorization.split(" ")[1]
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
            } as SessionUser;
            next();
        } else {
            return res.status(401).json({ msg: "Unauthorized" });
        }
    } catch (error) {
        console.error("Error in requireSignInMiddleware:", error);
        return res.status(500).json({ msg: error.message });
    }
};

const verifyToken = (token: string): Promise<SessionUser | null> => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, user) => {
            if (err) {
                reject(err);
            } else {
                resolve(user as SessionUser);
            }
        });
    });
};



export const attachTokenUserId = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        let token = req.headers.authorization;
        if (!token) {
            next()
        } else {
            token = req.headers.authorization.split(" ")[1]

            const user = await verifyToken(token);
            if (user) {
                const dbUser = await User.findOne({ _id: user._id });
                if (!dbUser) {
                    next()
                } else {
                    req.user = { _id: String(dbUser._id) }
                    next()
                }
            }
        }
    } catch (error) {
        next()
    }
};

export const requireAdminSignInMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        let token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ msg: "Unauthorized" });
        }
        token = req.headers.authorization.split(" ")[1]
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
            } as SessionUser;
            next();
        } else {
            return res.status(401).json({ msg: "Unauthorized" });
        }
    } catch (error) {
        console.error("Error in requireSignInMiddleware:", error);
        return res.status(500).json({ msg: error.message });
    }
};