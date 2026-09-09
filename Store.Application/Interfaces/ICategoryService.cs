using Store.Application.DTOs.Categories;

namespace Store.Application.Interfaces
{
    public interface ICategoryService
    {
        Task<IReadOnlyList<CategoryDto>> GetAllAsync();
        Task<CategoryDto> FindOrCreateAsync(string name);
    }
}