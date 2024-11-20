import request from "supertest";
import app from "../../../app"; // Replace with your app entry point
import ProductController from "./product.controller"; // Replace with controller path

const generateProductData = () => ({
  Name: "Test Product",
  Quantity: 10,
  Category: "Electronics",
});

const buildExpectedResponse = (statusCode: any, message: any, data: any) => ({
  statusCode,
  message,
  data,
});

describe("ProductController", () => {
  it("GET", () => {
    test("should create a new product", async () => {
      const productData = generateProductData();
      const response = await request(app)
        .post("/api/v1/products")
        .send(productData)
        .expect(201);

      expect(response.body).toHaveProperty("ID");
      expect(response.body.Name).toEqual(productData.Name);
    });

    test("should throw error for existing product", async () => {
      const productData = generateProductData();
      await request(app).post("/products").send(productData);

      const response = await request(app)
        .post("/products")
        .send(productData)
        .expect(409);
      1;

      expect(response.body.message).toEqual("Product already exists");
    });
  });
});
