"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Response {
    static send(res, status, message, data) {
        const responseData = {
            message,
            data: data || null,
        };
        return res.status(status).json(responseData);
    }
}
exports.default = Response;
