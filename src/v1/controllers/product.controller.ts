import { addLog } from "../utils/eventLogger";
import catchAsync from "../utils/catchAsync";
import prisma from "../../client";
import { paginate } from "../utils/paginate";
import Response from "../utils/response";
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from "../utils/exception";

export default class ProductController {
  static findProductById = async (id: string) => {
    return await prisma.products.findUnique({ where: { ID: id } });
  };

  static createOneProduct = catchAsync(async (req, res) => {
    const { Name, Quantity, Category } = req.body;

    const productExists = await prisma.products.findUnique({
      where: { Name },
    });
    if (productExists) {
      throw new ConflictException("Product already exists");
    }

    const product = await prisma.products.create({
      data: { Name, Quantity, Category },
    });

    addLog("Added", product.ID, { Name, Quantity, Category });

    return Response.send(res, 201, "Product created", product);
  });

  static updateOneProduct = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { Quantity, ...data } = req.body;

    if (Quantity < 0)
      throw new ForbiddenException("Product must be greater than zero");

    const productExists = await this.findProductById(id);
    if (!productExists) throw new NotFoundException("Product not Found");

    const updateProduct = await prisma.products.update({
      where: { ID: id },
      data: { Quantity, ...data },
    });

    addLog("Updated", id, { Quantity, ...data });
    return Response.send(res, 200, "Updated", updateProduct);
  });

  static deleteOneProduct = catchAsync(async (req, res) => {
    const { id } = req.params;
    if (!id) throw new BadRequestException("productId is required");

    const product = await this.findProductById(id);
    if (!product) throw new NotFoundException("Product not Found");

    await prisma.products.delete({ where: { ID: id } });

    if (product?.Quantity ?? 0 > 0)
      throw new ForbiddenException("Product must be greater than zero");

    const afterDelete = await prisma.products.delete({ where: { ID: id } });

    addLog("Deleted", id, { afterDelete });

    return Response.send(res, 200, "Deleted", afterDelete);
  });

  static getOneProduct = catchAsync(async (req, res) => {
    const { id } = req.params;
    if (!id) throw new BadRequestException("productId is required");

    const product = await this.findProductById(id);
    if (!product) throw new NotFoundException("Product not Found");
    return Response.send(res, 200, "retrieve", product);
  });

  static getAllProducts = catchAsync(async (req, res) => {
    try {
      const { Category, minQuantity, maxQuantity } = req.query;
      const page = parseInt(req.query.page as string) || 0;
      const size = parseInt(req.query.size as string) || 0;

      const filter: Record<string, any> = {};

      if (Category) filter.Category = Category as string;

      if (minQuantity || maxQuantity) {
        filter.Quantity = {};
        if (maxQuantity) filter.Quantity.lt = parseInt(maxQuantity as string);
      }

      const products = await paginate(prisma.products, page, size, filter);
      return Response.send(res, 200, "Retrieve Products", products);
    } catch (error) {}
  });
}
