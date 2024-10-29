import { addLog } from "../utils/eventLogger";
import catchAsync from "../utils/catchAsync";
import prisma from "../../client";
import { paginate } from "../utils/paginate";
import Response from "../utils/response";

export default class ProductController {
  static findProductById = async (id: string) => {
    console.log("problem here");
    return await prisma.products.findUnique({ where: { ID: id } });
  };

  static createOneProduct = catchAsync(async (req, res) => {
    const { Name, Quantity, Category } = req.body;
    if (!Name || Quantity === undefined || !Category) {
      return res.status(400).json("Missing required fields");
    }

    const productExists = await prisma.products.findUnique({
      where: { Name },
    });
    if (productExists) {
      return Response.send(res, 409, "exists", productExists);
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

    if (Quantity < 0) return res.status(409).json("Invalid Input");

    const productExists = await this.findProductById(id);
    if (!productExists)
      return Response.send(
        res,
        400,
        "The product to be updated is not present"
      );

    const updateProduct = await prisma.products.update({
      where: { ID: id },
      data: { Quantity, ...data },
    });
    addLog("Updated", id, { Quantity, ...data });
    return Response.send(res, 200, "Updated", updateProduct);
  });

  static deleteOneProduct = catchAsync(async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json("ID not provided");

    const product = await this.findProductById(id);
    if (!product) return res.status(404).json("Product not found");

    await prisma.products.delete({ where: { ID: id } });

    if (product?.Quantity ?? 0 > 0)
      return res
        .status(200)
        .json("The product to be deleted has quantity greater than zero");

    const afterDelete = await prisma.products.delete({ where: { ID: id } });

    addLog("Deleted", id, {});

    return Response.send(res, 200, "Deleted", afterDelete);
  });

  static getOneProduct = catchAsync(async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json("ID not provided");

    const product = await this.findProductById(id);
    if (!product) return res.status(404).json("The product is not present");
    return res.status(200).json({ msg: "retrieve", data: product });
  });

  static getAllProducts = catchAsync(async (req, res) => {
    try {
      // const { Category, minQuantity, maxQuantity } = req.query;
      // const page = parseInt(req.query.page as string) || 0;
      // const size = parseInt(req.query.size as string) || 0;

      // const filter: Record<string, any> = {};

      // if (Category) filter.Category = Category as string;

      // if (minQuantity || maxQuantity) {
      //   filter.Quantity = {};
      //   if (maxQuantity) filter.Quantity.lt = parseInt(maxQuantity as string);
      // }
      // , page, size, filter
      const products = await prisma.products.findMany();
      return Response.send(res, 200, "Retrieve Products", products);
    } catch (error) {}
  });
}
