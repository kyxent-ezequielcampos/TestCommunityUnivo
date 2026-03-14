import { ProviderInterface } from "../interfaces/Providers.interface";
import { providerModel } from "../models/Providers.model";
import { ListQueryOptions, PaginatedResult } from "../interfaces/Common.interface";
import { buildSortObject } from "../utils/queryParser";

class ProviderRepository {
  model = providerModel;

  async getAllProviders(query: ListQueryOptions): Promise<PaginatedResult<ProviderInterface>> {
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

      const [providers, totalItems] = await Promise.all([
        dbQuery,
        this.model.countDocuments(query.filters),
      ]);

      return {
        items: providers,
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

  async getProviderById(id: string): Promise<ProviderInterface | null> {
    try {
      const provider = await this.model.findById(id);
      return provider;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async createProvider(
    data: Partial<ProviderInterface>,
  ): Promise<ProviderInterface> {
    try {
      const provider = await this.model.create(data);

      return provider;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async updateProvider(
    id: string,
    data: Partial<ProviderInterface>,
  ): Promise<ProviderInterface | null> {
    try {
      const provider = await this.model.findByIdAndUpdate(id, data, {
        returnDocument: "after",
      });

      return provider;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async deleteProvider(id: string): Promise<ProviderInterface | null> {
    try {
      const provider = await this.model.findByIdAndDelete(id);

      return provider;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
}

export const providerRepository = new ProviderRepository();
