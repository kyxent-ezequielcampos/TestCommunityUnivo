import { ListQueryOptions } from "../interfaces/Common.interface";

const RESERVED_QUERY_KEYS = new Set(["page", "limit", "per_page", "sort", "fields"]);

const parseNumber = (value: unknown, defaultValue: number) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return defaultValue;
  return Math.floor(parsed);
};

const parsePrimitiveValue = (value: string): unknown => {
  const normalized = value.trim();
  if (normalized === "true") return true;
  if (normalized === "false") return false;

  const asNumber = Number(normalized);
  if (!Number.isNaN(asNumber) && normalized !== "") return asNumber;

  return normalized;
};

export const parseListQuery = (query: Record<string, unknown>): ListQueryOptions => {
  const page = parseNumber(query.page, 1);
  const limit = parseNumber(query.limit ?? query.per_page, 10);

  const sort = typeof query.sort === "string"
    ? query.sort.split(",").map((part) => part.trim()).filter(Boolean)
    : [];

  const fields = typeof query.fields === "string"
    ? query.fields.split(",").map((part) => part.trim()).filter(Boolean)
    : [];

  const filters: Record<string, unknown> = {};

  Object.entries(query).forEach(([key, value]) => {
    if (RESERVED_QUERY_KEYS.has(key) || value === undefined || value === null) return;

    if (typeof value !== "string") return;

    const operatorMatch = key.match(/^(\w+)\[(gte|lte|gt|lt|like)\]$/);

    if (operatorMatch) {
      const [, field, operator] = operatorMatch;
      const parsedValue = parsePrimitiveValue(value);

      if (!filters[field] || typeof filters[field] !== "object") {
        filters[field] = {};
      }

      const currentFieldFilter = filters[field] as Record<string, unknown>;

      if (operator === "like") {
        currentFieldFilter.$regex = String(parsedValue);
        currentFieldFilter.$options = "i";
      }

      if (operator === "gte") currentFieldFilter.$gte = parsedValue;
      if (operator === "lte") currentFieldFilter.$lte = parsedValue;
      if (operator === "gt") currentFieldFilter.$gt = parsedValue;
      if (operator === "lt") currentFieldFilter.$lt = parsedValue;
      return;
    }

    filters[key] = parsePrimitiveValue(value);
  });

  return {
    page,
    limit,
    fields,
    sort,
    filters,
  };
};

export const buildSortObject = (sort: string[]): Record<string, 1 | -1> => {
  if (!sort.length) return { createdAt: -1 };

  return sort.reduce<Record<string, 1 | -1>>((acc, item) => {
    if (!item) return acc;
    const isDesc = item.startsWith("-");
    const field = isDesc ? item.slice(1) : item;
    if (!field) return acc;
    acc[field] = isDesc ? -1 : 1;
    return acc;
  }, {});
};