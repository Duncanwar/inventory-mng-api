import { Router } from "express";

import productRoute from "./product.route";
import logRoute from "./log.route";

const route: Router = Router();

route.use("/products/", productRoute);
route.use("/logs", logRoute);

export default route;
