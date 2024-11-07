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
    // return res;
  };

  it("should return 400 if id is not provided", async () => {
    const req = { params: {} } as Request;
    const res = mockResponse();

    // Assuming findProductById would return 400 status for missing id
    await expect(ProductController.findProductById("")).rejects.toThrowError(
      "Missing required parameter: id"
    );
  });

  it("should return 200 with product data if id is valid", async () => {
    const req = { params: { id: "valid-product-id" } } as unknown as Request;
    const res = mockResponse();

    const mockProduct = { ID: "valid-product-id", Name: "Sample Product" };
    (prismaClient.products.findUnique as jest.Mock).mockResolvedValue(
      mockProduct
    );

    const product = await ProductController.findProductById("valid-product-id");

    expect(product).toEqual(mockProduct);
  });

  it("should return 404 if product is not found", async () => {
    (prismaClient.products.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(
      ProductController.findProductById("non-existing-id")
    ).rejects.toThrowError("Product not found");
  });
});
