// tests/unit/product.controller.test.ts
import { NextFunction, Request, Response } from "express";
import ProductController from "./product.controller";
import prisma from "../../../client";
import { addLog } from "../../utils/eventLogger";
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from "../../utils/exception";

jest.mock("../../utils/eventLogger"); // Mock event logger

describe("ProductController Unit Tests", () => {
  const mockProduct = {
    ID: "123",
    Name: "Test Product",
    Quantity: 10,
    Category: "Test Category",
  };

  const mockReqRes = () => {
    const req = {} as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    return { req, res };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a product directly using the controller", async () => {
    const { req, res } = mockReqRes();
    const next = {} as NextFunction;
    req.body = {
      Name: "Test Product",
      Quantity: 10,
      Category: "Test Category",
    };

    jest.spyOn(prisma.products, "findUnique").mockResolvedValueOnce(null);
    jest.spyOn(prisma.products, "create").mockResolvedValueOnce(mockProduct);

    await ProductController.createOneProduct(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Product created" })
    );
    expect(addLog).toHaveBeenCalledWith(
      "Added",
      mockProduct.ID,
      expect.any(Object)
    );
  });

  it("should throw ConflictException if product exists", async () => {
    const { req, res } = mockReqRes();
    const next = {} as NextFunction;
    req.body = {
      Name: "Test Product",
      Quantity: 10,
      Category: "Test Category",
    };

    jest
      .spyOn(prisma.products, "findUnique")
      .mockResolvedValueOnce(mockProduct);

    try {
      await ProductController.createOneProduct(req, res, next);
    } catch (error) {
      if (error instanceof ConflictException) {
        expect(error.message).toBe("Product already exists");
      } else {
        fail("Expected error to be of type ConflictException");
      }
    }
  });

  it("should update a product directly using the controller", async () => {
    const { req, res } = mockReqRes();
    const next = {} as NextFunction;
    req.params = { id: "123" };
    req.body = { Quantity: 20 };

    jest
      .spyOn(prisma.products, "findUnique")
      .mockResolvedValueOnce(mockProduct);
    jest
      .spyOn(prisma.products, "update")
      .mockResolvedValueOnce({ ...mockProduct, Quantity: 20 });

    await ProductController.updateOneProduct(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Updated" })
    );
    expect(addLog).toHaveBeenCalledWith("Updated", "123", expect.any(Object));
  });

  it("should throw NotFoundException if product to update does not exist", async () => {
    const { req, res } = mockReqRes();
    const next = {} as NextFunction;
    req.params = { id: "123" };
    req.body = { Quantity: 20 };

    jest.spyOn(prisma.products, "findUnique").mockResolvedValueOnce(null);

    try {
      await ProductController.updateOneProduct(req, res, next);
    } catch (error) {
      if (error instanceof NotFoundException) {
        expect(error.message).toBe("Product not Found");
      } else {
        fail("Expected error to be of type NotFoundException");
      }
    }
  });

  // Additional unit tests for other controller methods...
});
