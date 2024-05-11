"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Replace 'your-secret-key' with your actual secret key
const secretKey = process.env.SECRET_KEY || "alnoorimustafa";
exports.default = async (user) => {
    try {
        if (secretKey === "") {
            throw new Error("Missing secret key");
        }
        // Customize the token payload as needed
        const tokenPayload = {
            ...user,
        };
        // Generate the JWT token
        const accessToken = jsonwebtoken_1.default.sign(tokenPayload, secretKey);
        return accessToken;
    }
    catch (error) {
        console.error("Error generating JWT token:", error);
        throw new Error("Failed to generate JWT token.");
    }
};
