"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_validation_1 = require("../validations/product.validation");
const product_controller_1 = __importDefault(require("../controllers/product.controller"));
const validate_1 = __importDefault(require("../middlewares/validate"));
const router = (0, express_1.Router)();
router.delete("/:id", product_controller_1.default.deleteOneProduct);
router.get("/:id", product_controller_1.default.getOneProduct);
router.get("/", product_controller_1.default.getAllProducts);
router.post("/", (0, validate_1.default)(product_validation_1.createProduct.body), product_controller_1.default.createOneProduct);
router.put("/:id", (0, validate_1.default)(product_validation_1.createProduct.body), product_controller_1.default.updateOneProduct);
exports.default = router;
