using Store.Application.DTOs.Brands;

namespace Store.Application.Interfaces
{
    public interface IBrandService
    {
        Task<IReadOnlyList<BrandDto>> GetAllAsync();
        Task<BrandDto> FindOrCreateAsync(string name);
    }
}