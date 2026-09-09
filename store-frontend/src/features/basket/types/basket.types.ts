export interface BasketItemDto {
  productId: number;
  name?: string;
  price?: number;
  quantity: number;
  imageUrl?: string;
}

export interface BasketDto {
  id: number;
  items: BasketItemDto[];
}
