"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Middleware to validate schema
const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
        res
            .status(400)
            .json({ message: error.details[0].message.replace(/["\\]/g, "") });
        return; // Explicitly returning after sending the response
    }
    next(); // Proceed to the next middleware if no error
};
exports.default = validate;
