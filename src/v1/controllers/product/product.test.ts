import request from "supertest";
import app from "../../../app";
import prisma from "../../../client";
import ProductController from "./product.controller";
import { addLog } from "../../utils/eventLogger";
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from "../../utils/exception";

jest.mock("../../utils/eventLogger"); // Mock event logger

describe("ProductController", () => {
  const mockProduct = {
    ID: "123",
    Name: "Test Product",
    Quantity: 10,
    Category: "Test Category",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createOneProduct", () => {
    it("should create a product successfully", async () => {
      jest.spyOn(prisma.products, "findUnique").mockResolvedValueOnce(null); // Product doesn't exist
      jest.spyOn(prisma.products, "create").mockResolvedValueOnce(mockProduct); // Mock product creation

      const response = await request(app).post("/api/v1/products").send({
        Name: "Test Product",
        Quantity: 10,
        Category: "Test Category",
      });
      console.log(response, "create");
      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Product created");
      expect(addLog).toHaveBeenCalledWith(
        "Added",
        mockProduct.ID,
        expect.any(Object)
      );
    });

    it("should return conflict error if product already exists", async () => {
      jest
        .spyOn(prisma.products, "findUnique")
        .mockResolvedValueOnce(mockProduct); // Product exists

      const response = await request(app).post("/api/v1/products").send({
        Name: "Test Product",
        Quantity: 10,
        Category: "Test Category",
      });

      expect(response.status).toBe(409);
      expect(response.body.message).toBe("Product already exists");
    });
  });

  describe("updateOneProduct", () => {
    it("should update the product successfully", async () => {
      jest
        .spyOn(prisma.products, "findUnique")
        .mockResolvedValueOnce(mockProduct); // Product exists
      jest
        .spyOn(prisma.products, "update")
        .mockResolvedValueOnce({ ...mockProduct, Quantity: 20 });

      const response = await request(app)
        .patch("/api/v1/products/123")
        .send({ Quantity: 20 });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Updated");
      expect(addLog).toHaveBeenCalledWith("Updated", "123", expect.any(Object));
    });

    it("should throw a NotFoundException if product is not found", async () => {
      jest.spyOn(prisma.products, "findUnique").mockResolvedValueOnce(null); // Product does not exist

      const response = await request(app)
        .patch("/api/v1/products/123")
        .send({ Quantity: 20 });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Product not Found");
    });
  });

  describe("deleteOneProduct", () => {
    it("should delete the product successfully", async () => {
      jest
        .spyOn(prisma.products, "findUnique")
        .mockResolvedValueOnce(mockProduct); // Product exists
      jest.spyOn(prisma.products, "delete").mockResolvedValueOnce(mockProduct);

      const response = await request(app).delete("/api/v1/products/123");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Deleted");
      expect(addLog).toHaveBeenCalledWith("Deleted", "123", expect.any(Object));
    });

    it("should throw NotFoundException if product does not exist", async () => {
      jest.spyOn(prisma.products, "findUnique").mockResolvedValueOnce(null); // Product does not exist

      const response = await request(app).delete("/api/v1/products/123");

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Product not Found");
    });
  });

  describe("getOneProduct", () => {
    it("should retrieve the product successfully", async () => {
      jest
        .spyOn(prisma.products, "findUnique")
        .mockResolvedValueOnce(mockProduct); // Product exists

      const response = await request(app).get("/api/v1/products/123");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("retrieve");
      expect(response.body.data).toEqual(mockProduct);
    });

    it("should throw NotFoundException if product is not found", async () => {
      jest.spyOn(prisma.products, "findUnique").mockResolvedValueOnce(null); // Product does not exist

      const response = await request(app).get("/api/v1/products/123");

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Product not Found");
    });
  });

  describe("getAllProducts", () => {
    it("should retrieve a list of products with pagination", async () => {
      jest
        .spyOn(prisma.products, "findMany")
        .mockResolvedValueOnce([mockProduct, mockProduct]); // Mock product list

      const response = await request(app).get("/api/v1/products?page=1&size=2");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Retrieve Products");
      expect(response.body.data).toHaveLength(2);
    });
  });
});
