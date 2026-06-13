export type Nullable<T> = T | null;

export type Maybe<T> = T | undefined;

export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export type Theme = 'light' | 'dark' | 'system';
