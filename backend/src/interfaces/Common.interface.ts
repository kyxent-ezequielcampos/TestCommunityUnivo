export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  items: T[];
  meta: PaginationMeta;
}

export interface ListQueryOptions {
  page: number;
  limit: number;
  fields: string[];
  sort: string[];
  filters: Record<string, unknown>;
}

export interface ApiErrorDetail {
  field: string;
  message: string;
}