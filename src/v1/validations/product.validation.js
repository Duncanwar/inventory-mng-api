"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProduct = void 0;
const joi_1 = __importDefault(require("joi"));
// Validation schema for creating a product
exports.createProduct = {
    body: joi_1.default.object().keys({
        Name: joi_1.default.string().required(),
        Quantity: joi_1.default.number().required(),
        Category: joi_1.default.string().required(),
    }),
};
