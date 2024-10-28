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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const eventLogger_1 = require("../utils/eventLogger");
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const client_1 = __importDefault(require("../../client"));
const paginate_1 = require("../utils/paginate");
const response_1 = __importDefault(require("../utils/response"));
class ProductController {
}
_a = ProductController;
ProductController.findProductById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield client_1.default.products.findUnique({ where: { ID: id } });
});
ProductController.createOneProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { Name, Quantity, Category } = req.body;
    if (!Name || Quantity === undefined || !Category) {
        return res.status(400).json("Missing required fields");
    }
    const productExists = yield client_1.default.products.findUnique({
        where: { Name },
    });
    if (productExists) {
        return response_1.default.send(res, 409, "exists", productExists);
    }
    const product = yield client_1.default.products.create({
        data: { Name, Quantity, Category },
    });
    (0, eventLogger_1.addLog)("Added", product.ID, { Name, Quantity, Category });
    return response_1.default.send(res, 201, "Product created", product);
}));
ProductController.updateOneProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const _b = req.body, { Quantity } = _b, data = __rest(_b, ["Quantity"]);
    if (Quantity < 0)
        return res.status(409).json("Invalid Input");
    const productExists = yield _a.findProductById(id);
    if (!productExists)
        return response_1.default.send(res, 400, "The product to be updated is not present");
    const updateProduct = yield client_1.default.products.update({
        where: { ID: id },
        data: Object.assign({ Quantity }, data),
    });
    (0, eventLogger_1.addLog)("Updated", id, Object.assign({ Quantity }, data));
    return response_1.default.send(res, 200, "Updated", updateProduct);
}));
ProductController.deleteOneProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { id } = req.params;
    if (!id)
        return res.status(400).json("ID not provided");
    const product = yield _a.findProductById(id);
    if (!product)
        return res.status(404).json("Product not found");
    yield client_1.default.products.delete({ where: { ID: id } });
    if ((_b = product === null || product === void 0 ? void 0 : product.Quantity) !== null && _b !== void 0 ? _b : 0 > 0)
        return res
            .status(200)
            .json("The product to be deleted has quantity greater than zero");
    const afterDelete = yield client_1.default.products.delete({ where: { ID: id } });
    (0, eventLogger_1.addLog)("Deleted", id, {});
    return response_1.default.send(res, 200, "Deleted", afterDelete);
}));
ProductController.getOneProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id)
        return res.status(400).json("ID not provided");
    const product = yield _a.findProductById(id);
    if (!product)
        return res.status(404).json("The product is not present");
    return res.status(200).json({ msg: "retrieve", data: product });
}));
ProductController.getAllProducts = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { Category, minQuantity, maxQuantity } = req.query;
        const page = parseInt(req.query.page) || 0;
        const size = parseInt(req.query.size) || 0;
        const filter = {};
        if (Category)
            filter.Category = Category;
        if (minQuantity || maxQuantity) {
            filter.Quantity = {};
            if (maxQuantity)
                filter.Quantity.lt = parseInt(maxQuantity);
        }
        const products = yield (0, paginate_1.paginate)(client_1.default.products, page, size, filter);
        return response_1.default.send(res, 200, "Retrieve Products", products);
    }
    catch (error) { }
}));
exports.default = ProductController;
