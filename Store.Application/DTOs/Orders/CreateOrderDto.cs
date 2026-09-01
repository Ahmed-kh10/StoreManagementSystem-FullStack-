namespace Store.Application.DTOs.Orders
{
    public class CreateOrderDto
    {
        public AddressDto ShippingAddress { get; set; } = default!;
    }
}
