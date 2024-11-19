import { NextFunction, Request, response, Response } from "express";
import request from "supertest";
import ProductController from "./product.controller";
import prismaClient from "../../../client";
import { paginate } from "../../utils/paginate";
import { Products } from "@prisma/client";
import app from "../../../app";

jest.mock("../../utils/paginate");
jest.mock("../../../client", () => ({
  products: {
    findUnique: jest.fn(),
  },
}));
jest.mock("./product.controller");

describe("ProductController", () => {
  describe("Get /products", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let jsonMock: jest.Mock;
    let statusMock: jest.Mock;

    beforeEach(() => {
      jsonMock = jest.fn();
      statusMock = jest.fn(() => ({ json: jsonMock })) as any;
      res = { status: statusMock, json: jsonMock };

      req = {
        query: {
          page: "1",
          size: "10",
          Category: "Electronics",
          minQuantity: "5",
          maxQuantity: "20",
        },
      };
    });
    it("should return a list of products", async () => {
      const mockProducts: Products[] = [
        { ID: "1", Name: "Product 1", Category: "Electronics", Quantity: 10 },
        { ID: "2", Name: "Product 2", Category: "Electronics", Quantity: 15 },
      ];
      (ProductController.getAllProducts as jest.Mock).mockResolvedValue(
        mockProducts
      );
      const Response = await request(app).get("/api/v1/products");
      expect(response.statusCode).toBe(200);
    });
  });
  10000;
});
// it("should return products successfully", async () => {
//   const mockProducts = [
//     { id: "1", name: "Product 1", Category: "Electronics", Quantity: 10 },
//     { id: "2", name: "Product 2", Category: "Electronics", Quantity: 15 },
//   ];
//   (paginate as jest.Mock).mockResolvedValueOnce(mockProducts);
//   const next: any = jest.fn();
//   ProductController.getAllProducts(req as Request, res as Response, next);

//   expect(paginate).toHaveBeenCalledWith(prismaClient.products, 1, 10, {
//     Category: "Electronics",
//     Quantity: { lt: 20 },
//   });
//   expect(statusMock).toHaveBeenCalledWith(200);
//   expect(jsonMock).toHaveBeenCalledWith({
//     message: "Retrieve Products",
//     data: mockProducts,
//   });
// });

// it("should handle errors gracefully", async () => {
//   const error = new Error("Database error");
//   (paginate as jest.Mock).mockRejectedValueOnce(error);
//   const next: any = jest.fn();
//   await ProductController.getAllProducts(
//     req as Request,
//     res as Response,
//     next
//   );

//   expect(statusMock).toHaveBeenCalledWith(500);
//   expect(jsonMock).toHaveBeenCalledWith({
//     message: "An error occurred",
//     error: error.message,
//   });
// });
// });
//   const res = {} as Response;
//   res.status = jest.fn().mockReturnValue(res);
//   res.json = jest.fn().mockReturnValue(res);
//   return res;
// };

// it("should return 400 if id is not provided", async () => {
//   const req = { params: {} } as Request;
//   const res = mockResponse();

//   // Assuming findProductById would return 400 status for missing id
//   await expect(ProductController.findProductById("")).rejects.toThrowError(
//     "Missing required parameter: id"
//   );
// });

// it("should return 200 with product data if id is valid", async () => {
//   const req = { params: { id: "valid-product-id" } } as unknown as Request;
//   const res = mockResponse();

//   const mockProduct = { ID: "valid-product-id", Name: "Sample Product" };
//   (prismaClient.products.findUnique as jest.Mock).mockResolvedValue(
//     mockProduct
//   );

//   const product = await ProductController.findProductById("valid-product-id");

//   expect(product).toEqual(mockProduct);
// });

// it("should return 404 if product is not found", async () => {
//   (prismaClient.products.findUnique as jest.Mock).mockResolvedValue(null);

//   await expect(
//     ProductController.findProductById("non-existing-id")
//   ).rejects.toThrowError("Product not found");
// });
