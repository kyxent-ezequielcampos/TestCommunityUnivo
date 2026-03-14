import React, { useCallback, useEffect } from "react";
import { providersService } from "../services/Providers.service";
import type { ProviderInterface } from "../interfaces/Providers.interface";
import type { PaginationMeta } from "../interfaces/Api.interface";

export const useProviderService = () => {
  const [providers, setProviders] = React.useState<ProviderInterface[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] = React.useState<ProviderInterface | null>(null);
  const [query, setQuery] = React.useState({
    page: 1,
    limit: 8,
    sort: "-createdAt",
    nameLike: "",
  });

  const [pagination, setPagination] = React.useState<PaginationMeta>({
    page: 1,
    limit: 8,
    totalItems: 0,
    totalPages: 1,
  });

  const getAllProviders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params: Record<string, string | number> = {
        page: query.page,
        limit: query.limit,
        sort: query.sort,
      };

      if (query.nameLike.trim()) {
        params["name[like]"] = query.nameLike.trim();
      }

      const response = await providersService.getAllProviders(params);
      setProviders(response.items);
      setPagination(response.meta);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    void getAllProviders();
  }, [getAllProviders]);

  const getProviderById = async (id: string) => {
    try {
      const response = await providersService.getProviderById(id);
      setSelectedProvider(response);
      return response;
    } catch (error) {
      setError((error as Error).message);
      return null;
    }
  };

  const createProvider = async (data: Partial<ProviderInterface>) => {
    try {
      await providersService.createProvider(data);
      await getAllProviders();
    } catch (error) {
      setError((error as Error).message);
      throw error;
    }
  };

  const updateProvider = async (
    id: string,
    data: Partial<ProviderInterface>,
  ) => {
    try {
      await providersService.updateProvider(id, data);
      await getAllProviders();
    } catch (error) {
      setError((error as Error).message);
      throw error;
    }
  };

  const deleteProvider = async (id: string) => {
    try {
      await providersService.deleteProvider(id);
      await getAllProviders();
    } catch (error) {
      setError((error as Error).message);
      throw error;
    }
  };

  const updateQuery = (next: Partial<typeof query>) => {
    setQuery((prev) => ({
      ...prev,
      ...next,
      page: next.page ?? (next.nameLike !== undefined || next.sort !== undefined || next.limit !== undefined ? 1 : prev.page),
    }));
  };

  return {
    providers,
    loading,
    error,
    pagination,
    query,
    selectedProvider,
    setSelectedProvider,
    getAllProviders,
    getProviderById,
    createProvider,
    updateProvider,
    deleteProvider,
    updateQuery,
  };
};
