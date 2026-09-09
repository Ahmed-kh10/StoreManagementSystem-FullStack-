using AutoMapper;
using Store.Application.DTOs.Brands;
using Store.Application.Interfaces;
using Store.Domain.Entities;

namespace Store.Application.Services
{
    public class BrandService : IBrandService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public BrandService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IReadOnlyList<BrandDto>> GetAllAsync()
        {
            var repo = _unitOfWork.Repository<Brand>();
            var brands = await repo.GetAllAsync();

            return _mapper.Map<IReadOnlyList<BrandDto>>(brands);
        }

        public async Task<BrandDto> FindOrCreateAsync(string name)
        {
            var trimmedName = name.Trim();

            var repo = _unitOfWork.Repository<Brand>();
            var brands = await repo.GetAllAsync();

            var existing = brands.FirstOrDefault(b =>
                string.Equals(
                    b.Name,
                    trimmedName,
                    StringComparison.OrdinalIgnoreCase));

            if (existing != null)
            {
                return _mapper.Map<BrandDto>(existing);
            }

            var newBrand = new Brand { Name = trimmedName };

            await repo.AddAsync(newBrand);
            await _unitOfWork.SaveChangesAsync();

            return _mapper.Map<BrandDto>(newBrand);
        }
    }
}