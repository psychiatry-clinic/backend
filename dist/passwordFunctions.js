"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPassword = exports.hashPassword = void 0;
const bcrypt = require("bcrypt");
async function hashPassword(password) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}
exports.hashPassword = hashPassword;
// Verify password
async function verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
}
exports.verifyPassword = verifyPassword;
