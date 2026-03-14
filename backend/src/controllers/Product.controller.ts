import { Context } from "elysia";
import { Types } from "mongoose";
import { ApiErrorDetail } from "../interfaces/Common.interface";
import { ProductInterface } from "../interfaces/Products.interface";
import { providerRepository } from "../repositories/Provider.repository";
import { productRepository } from "../repositories/Product.repository";
import { ApiError } from "../utils/ApiError";
import { parseListQuery } from "../utils/queryParser";

class ProductController {
  repository = productRepository;

  private async validateProductPayload(data: Partial<ProductInterface>, isUpdate = false) {
    const details: ApiErrorDetail[] = [];

    if (!isUpdate && !data.name?.trim()) {
      details.push({ field: "name", message: "Name is required" });
    }

    if (!isUpdate && (typeof data.price !== "number" || data.price <= 0)) {
      details.push({ field: "price", message: "Price must be a positive number" });
    }

    if (!isUpdate && !data.providerId?.trim()) {
      details.push({ field: "providerId", message: "Provider is required" });
    }

    if (data.providerId && !Types.ObjectId.isValid(data.providerId)) {
      details.push({ field: "providerId", message: "Provider id is invalid" });
    }

    if (details.length) {
      throw new ApiError(422, "VALIDATION_ERROR", "Invalid input data", details);
    }

    if (data.providerId) {
      const providerExists = await providerRepository.getProviderById(data.providerId);
      if (!providerExists) {
        throw new ApiError(404, "NOT_FOUND", "Provider not found");
      }
    }
  }

  private formatError(c: Context, error: unknown) {
    if (error instanceof ApiError) {
      c.status(error.status);
      return {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
      };
    }

    c.status(500);
    return {
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: (error as Error).message,
      },
    };
  }

  async getAllProducts(c: Context) {
    try {
      const query = parseListQuery(c.query as Record<string, unknown>);
      const products = await this.repository.getAllProducts(query);

      c.status(200);
      return {
        success: true,
        data: products,
      };
    } catch (error) {
      return this.formatError(c, error);
    }
  }

  async getProductById(c: Context) {
    try {
      const { id } = c.params as { id: string };

      if (!Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "INVALID_ID", "Invalid product id");
      }

      const product = await this.repository.getProductById(id);

      if (!product) {
        throw new ApiError(404, "NOT_FOUND", "Product not found");
      }

      c.status(200);
      return {
        success: true,
        data: product,
      };
    } catch (error) {
      return this.formatError(c, error);
    }
  }

  async createProduct(c: Context) {
    try {
      const data = c.body as ProductInterface;

      await this.validateProductPayload(data);

      const product = await this.repository.createProduct(data);

      c.status(201);
      return {
        success: true,
        data: product,
      };
    } catch (error) {
      return this.formatError(c, error);
    }
  }

  async updateProduct(c: Context) {
    try {
      const { id } = c.params as { id: string };

      if (!Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "INVALID_ID", "Invalid product id");
      }

      const data = c.body as ProductInterface;
      await this.validateProductPayload(data, true);

      const product = await this.repository.updateProduct(id, data);

      if (!product) {
        throw new ApiError(404, "NOT_FOUND", "Product not found");
      }

      c.status(200);
      return {
        success: true,
        data: product,
      };
    } catch (error) {
      return this.formatError(c, error);
    }
  }

  async deleteProduct(c: Context) {
    try {
      const { id } = c.params as { id: string };

      if (!Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "INVALID_ID", "Invalid product id");
      }

      const product = await this.repository.deleteProduct(id);

      if (!product) {
        throw new ApiError(404, "NOT_FOUND", "Product not found");
      }

      c.status(204);
      return null;
    } catch (error) {
      return this.formatError(c, error);
    }
  }
}

export const productController = new ProductController();