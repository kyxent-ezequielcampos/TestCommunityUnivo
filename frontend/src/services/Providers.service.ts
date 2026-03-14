import type { ProviderInterface } from "../interfaces/Providers.interface";
import type { ListQueryParams, PaginatedData } from "../interfaces/Api.interface";
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

class ProvidersService {
  async getAllProviders(params: ListQueryParams = {}) {
    try {
      const request = await api.get("/providers", { params });

      return unwrapData<PaginatedData<ProviderInterface>>(request.data);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async getProviderById(id: string) {
    try {
      const request = await api.get(`/providers/${id}`);

      return unwrapData<ProviderInterface>(request.data);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async createProvider(data: Partial<ProviderInterface>) {
    try {
      const request = await api.post("/providers", data);

      return unwrapData<ProviderInterface>(request.data);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async updateProvider(id: string, data: Partial<ProviderInterface>) {
    try {
      const request = await api.put(`/providers/${id}`, data);

      return unwrapData<ProviderInterface | null>(request.data);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async deleteProvider(id: string) {
    try {
      await api.delete(`/providers/${id}`);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
}

export const providersService = new ProvidersService();
