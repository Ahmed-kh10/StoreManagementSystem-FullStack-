namespace Store.Domain.Entities
{
    public class Order : BaseEntity
    {
        public string BuyerId { get; set; } = default!;

        public DateTime OrderDate { get; set; } = DateTime.UtcNow;

        public decimal Subtotal { get; set; }

        public decimal ShippingPrice { get; set; }

        public decimal Total { get; set; }

        public OrderStatus Status { get; set; }

        public string? PaymentIntentId { get; set; }

        public string PaymentStatus { get; set; } = "Pending";

        public Address ShippingAddress { get; set; } = default!;

        public ICollection<OrderItem> Items { get; set; }
            = new List<OrderItem>();
    }
}
