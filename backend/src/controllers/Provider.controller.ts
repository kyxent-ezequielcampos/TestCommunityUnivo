import { Context } from "elysia";
import { Types } from "mongoose";
import { ApiErrorDetail } from "../interfaces/Common.interface";
import { providerRepository } from "../repositories/Provider.repository";
import { ProviderInterface } from "../interfaces/Providers.interface";
import { ApiError } from "../utils/ApiError";
import { parseListQuery } from "../utils/queryParser";

class ProviderController {
  repository = providerRepository;

  private validateProviderPayload(data: Partial<ProviderInterface>, isUpdate = false) {
    const details: ApiErrorDetail[] = [];

    if (!isUpdate && !data.name?.trim()) {
      details.push({ field: "name", message: "Name is required" });
    }

    if (!isUpdate && !data.address?.trim()) {
      details.push({ field: "address", message: "Address is required" });
    }

    if (!isUpdate && !data.phone?.trim()) {
      details.push({ field: "phone", message: "Phone is required" });
    }

    if (details.length) {
      throw new ApiError(422, "VALIDATION_ERROR", "Invalid input data", details);
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

  async getAllProviders(c: Context) {
    try {
      const query = parseListQuery(c.query as Record<string, unknown>);
      const providers = await this.repository.getAllProviders(query);

      c.status(200);
      return {
        success: true,
        data: providers,
      };
    } catch (error) {
      return this.formatError(c, error);
    }
  }

  async getProviderById(c: Context) {
    try {
      const { id } = c.params as { id: string };

      if (!Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "INVALID_ID", "Invalid provider id");
      }

      const provider = await this.repository.getProviderById(id);

      if (!provider) {
        throw new ApiError(404, "NOT_FOUND", "Provider not found");
      }

      c.status(200);
      return {
        success: true,
        data: provider,
      };
    } catch (error) {
      return this.formatError(c, error);
    }
  }

  async createProvider(c: Context) {
    try {
      const data = c.body as ProviderInterface;

      this.validateProviderPayload(data);

      const provider = await this.repository.createProvider(data);

      c.status(201);
      return {
        success: true,
        data: provider,
      };
    } catch (error) {
      return this.formatError(c, error);
    }
  }

  async updateProvider(c: Context) {
    try {
      const { id } = c.params as { id: string };

      if (!Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "INVALID_ID", "Invalid provider id");
      }

      const data = c.body as ProviderInterface;
      this.validateProviderPayload(data, true);

      const provider = await this.repository.updateProvider(id, data);

      if (!provider) {
        throw new ApiError(404, "NOT_FOUND", "Provider not found");
      }

      c.status(200);
      return {
        success: true,
        data: provider,
      };
    } catch (error) {
      return this.formatError(c, error);
    }
  }

  async deleteProvider(c: Context) {
    try {
      const { id } = c.params as { id: string };

      if (!Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "INVALID_ID", "Invalid provider id");
      }

      const provider = await this.repository.deleteProvider(id);

      if (!provider) {
        throw new ApiError(404, "NOT_FOUND", "Provider not found");
      }

      c.status(204);
      return null;
    } catch (error) {
      return this.formatError(c, error);
    }
  }
}

export const providerController = new ProviderController();
