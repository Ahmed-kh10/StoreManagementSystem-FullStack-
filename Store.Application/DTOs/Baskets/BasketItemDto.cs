namespace Store.Application.DTOs.Baskets
{
    public class BasketItemDto
    {
        public int ProductId { get; set; }

        public string? Name { get; set; }

        public decimal? Price { get; set; }

        public int Quantity { get; set; }

        public string? ImageUrl { get; set; }
    }
}