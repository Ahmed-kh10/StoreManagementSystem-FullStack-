export interface AddressDto {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface CreateOrderDto {
  shippingAddress: AddressDto;
}

export interface OrderItemDto {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  total: number;
}

export interface OrderDto {
  id: number;
  buyerId: string;
  orderDate: string;
  subtotal: number;
  shippingPrice: number;
  total: number;
  status: string;
  paymentStatus: string;
  shippingAddress: AddressDto;
  items: OrderItemDto[];
}
