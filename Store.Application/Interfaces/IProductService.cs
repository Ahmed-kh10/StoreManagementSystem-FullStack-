using Store.Application.DTOs.Commen;
using Store.Application.DTOs.Products;

namespace Store.Application.Interfaces
{
    public interface IProductService
    {
        Task<Pagination<ProductDto>> GetAllProductsAsync(ProductSpecParams specParams);

        Task<ProductDto?> GetProductByIdAsync(int productId);

        Task<ProductDto> AddProductAsync(CreateProductDto createProductDto);

        Task<ProductDto?> UpdateProductAsync(int productId,UpdateProductDto updateProductDto);

        Task<bool> DeleteProductAsync(int productId);
    }
}