import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";

// Middleware to validate schema
const validate =
  (schema: ObjectSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body);

    if (error) {
      res
        .status(400)
        .json({ message: error.details[0].message.replace(/["\\]/g, "") });
      return; // Explicitly returning after sending the response
    }

    next(); // Proceed to the next middleware if no error
  };

export default validate;
