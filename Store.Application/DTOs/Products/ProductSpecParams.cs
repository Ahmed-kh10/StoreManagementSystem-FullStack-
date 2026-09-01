namespace Store.Application.DTOs.Products
{
    public class ProductSpecParams
    {
        public string? Search { get; set; }

        public int? BrandId { get; set; }

        public int? CategoryId { get; set; }

        public decimal? MinPrice { get; set; }

        public decimal? MaxPrice { get; set; }

        public int PageIndex { get; set; } = 1;

        public int PageSize { get; set; } = 5;

        public string? Sort { get; set; }
    }
}