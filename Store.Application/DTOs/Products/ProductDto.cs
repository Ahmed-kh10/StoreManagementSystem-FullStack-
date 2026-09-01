namespace Store.Application.DTOs.Products
{
    public class ProductDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = default!;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public string ImageUrl { get; set; } = default!;
        public string BrandName { get; set; } = default!;
        public string CategoryName { get; set; } = default!;
    }
}
