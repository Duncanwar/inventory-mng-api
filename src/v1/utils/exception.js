"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConflictException = exports.NotFoundException = exports.BadRequestException = exports.CustomException = void 0;
class CustomException extends Error {
    constructor(message, name, statusCode) {
        super(message);
        this.name = name;
        this.statusCode = statusCode;
    }
}
exports.CustomException = CustomException;
class BadRequestException extends CustomException {
    constructor(message) {
        super(message || "Bad Request", "BadRequestException", 400);
    }
}
exports.BadRequestException = BadRequestException;
class NotFoundException extends CustomException {
    constructor(message) {
        super(message || "Not Found", "NotFoundException", 404);
    }
}
exports.NotFoundException = NotFoundException;
class ConflictException extends CustomException {
    constructor(message) {
        super(message || "Conflict", "ConflictException", 409);
    }
}
exports.ConflictException = ConflictException;
