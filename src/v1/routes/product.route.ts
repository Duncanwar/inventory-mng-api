import { Router } from "express";

import { createProduct } from "../validations/product.validation";
import ProductController from "../controllers/product.controller";
import validate from "../middlewares/validate";

const router: Router = Router();

router.delete("/:id", ProductController.deleteOneProduct);

router.get("/:id", ProductController.getOneProduct);

router.get("/", ProductController.getAllProducts);

router.post(
  "/",
  validate(createProduct.body),
  ProductController.createOneProduct
);

router.put(
  "/:id",
  validate(createProduct.body),
  ProductController.updateOneProduct
);

export default router;
