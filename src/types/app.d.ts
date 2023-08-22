import { SessionUser } from "./index.js";

declare module 'express' {
    interface Request {
        user: SessionUser;
    }
}