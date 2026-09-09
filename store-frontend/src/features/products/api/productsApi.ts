import { apiClient } from '@/lib/api/apiClient';
import type {
  Pagination,
  ProductDto,
  ProductSpecParams,
} from '@/features/products/types/product.types';

function buildQueryParams(
  params: ProductSpecParams,
): Record<string, string | number> {
  const query: Record<string, string | number> = {
    pageIndex: params.pageIndex ?? 1,
    pageSize: params.pageSize ?? 5,
  };

  if (params.search) query.search = params.search;
  if (params.brandId) query.brandId = params.brandId;
  if (params.categoryId) query.categoryId = params.categoryId;
  if (params.minPrice !== undefined) query.minPrice = params.minPrice;
  if (params.maxPrice !== undefined) query.maxPrice = params.maxPrice;
  if (params.sort) query.sort = params.sort;

  return query;
}

export const productsApi = {
  getAll: async (
    params: ProductSpecParams,
  ): Promise<Pagination<ProductDto>> => {
    const { data } = await apiClient.get<Pagination<ProductDto>>('/Products', {
      params: buildQueryParams(params),
    });
    return data;
  },

  getById: async (id: number): Promise<ProductDto> => {
    const { data } = await apiClient.get<ProductDto>(`/Products/${id}`);
    return data;
  },
};
