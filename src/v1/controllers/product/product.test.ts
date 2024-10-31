// product.controller.test.ts
import { Request, Response } from "express";
import ProductController from "./product.controller";
import prismaClient from "../../../client";

jest.mock("../../../client", () => ({
  products: {
    findUnique: jest.fn(),
  },
}));

describe("ProductController.findProductById", () => {
  const mockResponse = (): Response => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  it("should return 400 if id is not provided", async () => {
    const req = { params: {} } as Request; // Simulating a missing id in request params
    const res = mockResponse();

    console.log(req);

    // await ProductController.findProductById(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Missing required parameter: id",
    });
  });

  it("should return 200 with product data if id is valid", async () => {
    const req = { params: { id: "valid-product-id" } } as unknown as Request;
    const res = mockResponse();

    const mockProduct = { id: "valid-product-id", name: "Sample Product" };
    (prismaClient.products.findUnique as jest.Mock).mockResolvedValue(
      mockProduct
    );

    // await ProductController.findProductById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockProduct);
  });

  it("should return 404 if product is not found", async () => {
    const req = { params: { id: "non-existing-id" } } as unknown as Request;
    const res = mockResponse();

    (prismaClient.products.findUnique as jest.Mock).mockResolvedValue(null); // Simulating no product found

    // await ProductController.findProductById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Product not found" });
  });
});
