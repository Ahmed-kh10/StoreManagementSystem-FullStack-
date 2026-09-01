namespace Store.Domain.Entities
{
    public class OrderItem : BaseEntity
    {
        public int OrderId { get; set; }

        public Order Order { get; set; } = default!;

        public int ProductId { get; set; }

        public Product Product { get; set; } = default!;

        public string ProductName { get; set; } = default!;

        public decimal Price { get; set; }

        public int Quantity { get; set; }

        public decimal Total { get; set; }
    }
}
