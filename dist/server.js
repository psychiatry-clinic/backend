"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const router_1 = __importDefault(require("./router"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const koa_1 = __importDefault(require("koa"));
const cors_1 = __importDefault(require("@koa/cors")); // Import koa-cors
const app = new koa_1.default();
app.use((0, cors_1.default)());
app.use((0, koa_bodyparser_1.default)());
app.use(router_1.default.routes()).use(router_1.default.allowedMethods());
app.listen(process.env.PORT || 3000, () => {
    console.log(`Server started on port ${process.env.PORT || 3000}`);
});
exports.default = app;
