import React, { useCallback, useEffect } from "react";
import type { PaginationMeta } from "../interfaces/Api.interface";
import type { ProductInterface } from "../interfaces/Products.interface";
import { productsService } from "../services/Products.service";

export const useProductService = () => {
  const [products, setProducts] = React.useState<ProductInterface[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = React.useState<ProductInterface | null>(null);
  const [query, setQuery] = React.useState({
    page: 1,
    limit: 8,
    sort: "-createdAt",
    nameLike: "",
    minPrice: "",
    maxPrice: "",
    providerId: "",
  });

  const [pagination, setPagination] = React.useState<PaginationMeta>({
    page: 1,
    limit: 8,
    totalItems: 0,
    totalPages: 1,
  });

  const getAllProducts = useCallback(async () => {
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

      if (query.minPrice.trim()) {
        params["price[gte]"] = query.minPrice.trim();
      }

      if (query.maxPrice.trim()) {
        params["price[lte]"] = query.maxPrice.trim();
      }

      if (query.providerId.trim()) {
        params.providerId = query.providerId.trim();
      }

      const response = await productsService.getAllProducts(params);
      setProducts(response.items);
      setPagination(response.meta);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    void getAllProducts();
  }, [getAllProducts]);

  const getProductById = async (id: string) => {
    try {
      const response = await productsService.getProductById(id);
      setSelectedProduct(response);
      return response;
    } catch (error) {
      setError((error as Error).message);
      return null;
    }
  };

  const createProduct = async (data: Partial<ProductInterface>) => {
    try {
      await productsService.createProduct(data);
      await getAllProducts();
    } catch (error) {
      setError((error as Error).message);
      throw error;
    }
  };

  const updateProduct = async (id: string, data: Partial<ProductInterface>) => {
    try {
      await productsService.updateProduct(id, data);
      await getAllProducts();
    } catch (error) {
      setError((error as Error).message);
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await productsService.deleteProduct(id);
      await getAllProducts();
    } catch (error) {
      setError((error as Error).message);
      throw error;
    }
  };

  const updateQuery = (next: Partial<typeof query>) => {
    setQuery((prev) => ({
      ...prev,
      ...next,
      page:
        next.page ??
        (next.nameLike !== undefined ||
        next.sort !== undefined ||
        next.limit !== undefined ||
        next.minPrice !== undefined ||
        next.maxPrice !== undefined ||
        next.providerId !== undefined
          ? 1
          : prev.page),
    }));
  };

  return {
    products,
    loading,
    error,
    pagination,
    query,
    selectedProduct,
    setSelectedProduct,
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    updateQuery,
  };
};