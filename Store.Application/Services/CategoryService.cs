using AutoMapper;
using Store.Application.DTOs.Categories;
using Store.Application.Interfaces;
using Store.Domain.Entities;

namespace Store.Application.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public CategoryService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IReadOnlyList<CategoryDto>> GetAllAsync()
        {
            var repo = _unitOfWork.Repository<Category>();
            var categories = await repo.GetAllAsync();

            return _mapper.Map<IReadOnlyList<CategoryDto>>(categories);
        }

        public async Task<CategoryDto> FindOrCreateAsync(string name)
        {
            var trimmedName = name.Trim();

            var repo = _unitOfWork.Repository<Category>();
            var categories = await repo.GetAllAsync();

            var existing = categories.FirstOrDefault(c =>
                string.Equals(
                    c.Name,
                    trimmedName,
                    StringComparison.OrdinalIgnoreCase));

            if (existing != null)
            {
                return _mapper.Map<CategoryDto>(existing);
            }

            var newCategory = new Category { Name = trimmedName };

            await repo.AddAsync(newCategory);
            await _unitOfWork.SaveChangesAsync();

            return _mapper.Map<CategoryDto>(newCategory);
        }
    }
}