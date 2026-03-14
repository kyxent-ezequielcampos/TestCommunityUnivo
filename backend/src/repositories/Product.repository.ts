import { ListQueryOptions, PaginatedResult } from "../interfaces/Common.interface";
import { ProductInterface } from "../interfaces/Products.interface";
import { productModel } from "../models/Products.model";
import { buildSortObject } from "../utils/queryParser";

class ProductRepository {
  model = productModel;

  async getAllProducts(query: ListQueryOptions): Promise<PaginatedResult<ProductInterface>> {
    try {
      const skip = (query.page - 1) * query.limit;
      const sort = buildSortObject(query.sort);
      const dbQuery = this.model
        .find(query.filters)
        .sort(sort)
        .skip(skip)
        .limit(query.limit);

      if (query.fields.length) {
        dbQuery.select(query.fields.join(" "));
      }

      const [products, totalItems] = await Promise.all([
        dbQuery,
        this.model.countDocuments(query.filters),
      ]);

      return {
        items: products,
        meta: {
          page: query.page,
          limit: query.limit,
          totalItems,
          totalPages: Math.max(1, Math.ceil(totalItems / query.limit)),
        },
      };
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async getProductById(id: string): Promise<ProductInterface | null> {
    try {
      const product = await this.model.findById(id);
      return product;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async createProduct(data: Partial<ProductInterface>): Promise<ProductInterface> {
    try {
      const product = await this.model.create(data);
      return product;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async updateProduct(id: string, data: Partial<ProductInterface>): Promise<ProductInterface | null> {
    try {
      const product = await this.model.findByIdAndUpdate(id, data, {
        returnDocument: "after",
      });
      return product;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async deleteProduct(id: string): Promise<ProductInterface | null> {
    try {
      const product = await this.model.findByIdAndDelete(id);
      return product;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
}

export const productRepository = new ProductRepository();