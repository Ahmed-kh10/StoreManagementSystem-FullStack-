export interface ProductPayload {
  name: string;
  description?: string;
  price: number;
  stock: number;
  imageUrl: string;
  brandId: number;
  categoryId: number;
}
