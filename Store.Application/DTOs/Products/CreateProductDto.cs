namespace Store.Application.DTOs.Products
{
    public class CreateProductDto
    {
        public string Name { get; set; } = default!;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public string ImageUrl { get; set; } = default!;
        public int BrandId { get; set; }
        public int CategoryId { get; set; }
    }
}
