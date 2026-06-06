// src/types/index.ts

/**
 * Generic pagination result type.
 */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
