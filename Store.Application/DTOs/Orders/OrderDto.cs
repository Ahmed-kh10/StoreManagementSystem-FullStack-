namespace Store.Application.DTOs.Orders
{
    public class OrderDto
    {
        public int Id { get; set; }

        public string BuyerId { get; set; } = default!;

        public DateTime OrderDate { get; set; }

        public decimal Subtotal { get; set; }

        public decimal ShippingPrice { get; set; }

        public decimal Total { get; set; }

        public string Status { get; set; } = default!;

        public string PaymentStatus { get; set; } = default!;

        public AddressDto ShippingAddress { get; set; } = default!;

        public List<OrderItemDto> Items { get; set; } = new();
    }
}



