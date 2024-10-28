import Joi from "joi";

// Validation schema for creating a product
export const createProduct = {
  body: Joi.object().keys({
    Name: Joi.string().required(),
    Quantity: Joi.number().required(),
    Category: Joi.string().required(),
  }),
};
