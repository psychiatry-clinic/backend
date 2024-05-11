"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secretKey = process.env.SECRET_KEY || "alnoorimustafa";
const jwtAuthMiddleware = (ctx, next) => {
    // Check if the request contains the API token in the headers
    const token = ctx.headers.authorization;
    const user_id = +ctx.params.user_id;
    if (token && user_id) {
        try {
            // Verify the JWT with the provided secret key
            const decoded = jsonwebtoken_1.default.verify(token.replace("Bearer ", ""), secretKey);
            if (decoded.id !== user_id) {
                ctx.status = 401;
                return;
            }
            // Set the authenticated user data in the request context
            ctx.state.user = decoded;
            // Proceed to the next middleware
            return next();
        }
        catch (err) {
            // Invalid token, send a 401 Unauthorized response
            ctx.status = 401;
            return;
        }
    }
    else {
        // API token is invalid or missing, send a 401 Unauthorized response
        ctx.status = 401;
    }
};
exports.default = jwtAuthMiddleware;
