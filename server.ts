require("dotenv").config();

import router from "./router";
import bodyParser from "koa-bodyparser";
import Koa from "koa";
import cors from "@koa/cors"; // Import koa-cors

const app = new Koa();

app.use(cors());

app.use(bodyParser());

app.use(router.routes()).use(router.allowedMethods());

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server started on port ${process.env.PORT || 3000}`);
});

export default app;
