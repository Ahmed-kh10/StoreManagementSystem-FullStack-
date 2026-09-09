export interface ProductDto {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  imageUrl: string;
  brandId: number;
  brandName: string;
  categoryId: number;
  categoryName: string;
}

export type ProductSort = 'priceAsc' | 'priceDesc';

export interface ProductSpecParams {
  search?: string;
  brandId?: number;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  pageIndex?: number;
  pageSize?: number;
  sort?: ProductSort;
}

export interface Pagination<T> {
  pageIndex: number;
  pageSize: number;
  count: number;
  data: T[];
}
