import type { ListQueryParams, PaginatedData } from "../interfaces/Api.interface";
import type { ProductInterface } from "../interfaces/Products.interface";
import { api } from "./instance.api";

type ApiResponse<T> = {
  success: boolean;
  data: T;
  error?: {
    code: string;
    message: string;
  };
};

const unwrapData = <T,>(payload: unknown): T => {
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as ApiResponse<T>).data;
  }
  return payload as T;
};

class ProductsService {
  async getAllProducts(params: ListQueryParams = {}) {
    try {
      const request = await api.get("/products", { params });

      return unwrapData<PaginatedData<ProductInterface>>(request.data);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async getProductById(id: string) {
    try {
      const request = await api.get(`/products/${id}`);

      return unwrapData<ProductInterface>(request.data);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async createProduct(data: Partial<ProductInterface>) {
    try {
      const request = await api.post("/products", data);

      return unwrapData<ProductInterface>(request.data);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async updateProduct(id: string, data: Partial<ProductInterface>) {
    try {
      const request = await api.put(`/products/${id}`, data);

      return unwrapData<ProductInterface | null>(request.data);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async deleteProduct(id: string) {
    try {
      await api.delete(`/products/${id}`);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
}

export const productsService = new ProductsService();