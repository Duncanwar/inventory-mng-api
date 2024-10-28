"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_1 = __importDefault(require("../utils/response"));
class ErrorHandler {
    static watch(handler) {
        return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield Promise.resolve(handler(req, res, next));
            }
            catch (error) {
                console.log({ error });
                next(error);
            }
        });
    }
    /** Handle invalid route
     *
     * @param {Request} req - request
     * @param {ExpressResponse} res - response
     * @returns {ExpressResponse} - Error message
     */
    static notFound(req, res) {
        return response_1.default.send(res, 404, "Sorry, That route is not here!");
    }
    /** Handle Uncaught exceptions
     *
     * @param {Error} err - error object
     * @returns {void} - Logs the error
     */
    static handleUncaught(err) {
        console.error(err.stack || err.message);
        process.exit(1);
    }
    /** Handle errors
     *
     * @param {Error} err - error
     * @param {Request} req - request
     * @param {ExpressResponse} res - response
     * @param {NextFunction} next - next function
     * @returns {ExpressResponse} - Error message
     */
    // eslint-disable-next-line no-unused-vars
    static handleErrors(err, req, res, next) {
        console.error(err.stack || err.message);
        return response_1.default.send(res, err.statusCode || err.status || 500, err.message || "Something Failed, Please try again");
    }
}
exports.default = ErrorHandler;
