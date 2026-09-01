using AutoMapper;
using Store.Application.DTOs.Commen;
using Store.Application.DTOs.Products;
using Store.Application.Interfaces;
using Store.Application.Specifications;
using Store.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Store.Application.Services
{
    public class ProductService : IProductService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ProductService(
            IUnitOfWork unitOfWork,
            IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<ProductDto> AddProductAsync(
            CreateProductDto createProductDto)
        {
            var repo = _unitOfWork.Repository<Product>();

            var product = _mapper.Map<Product>(createProductDto);

            await repo.AddAsync(product);
            await _unitOfWork.SaveChangesAsync();

            return _mapper.Map<ProductDto>(product);
        }

        public async Task<bool> DeleteProductAsync(int productId)
        {
            var repo = _unitOfWork.Repository<Product>();

            var product = await repo.GetByIdAsync(productId);

            if (product == null)
            {
                return false;
            }

            try
            {
                await repo.DeleteAsync(productId);
                await _unitOfWork.SaveChangesAsync();

                return true;
            }
            catch (DbUpdateException)
            {
                throw new InvalidOperationException(
                    "لا يمكن حذف هذا المنتج لأنه مرتبط ببيانات أخرى (سلة أو طلب).");
            }
        }

        public async Task<Pagination<ProductDto>> GetAllProductsAsync(
            ProductSpecParams specParams)
        {
            var repo = _unitOfWork.Repository<Product>();

            var spec = new ProductFilterSpecification(specParams);

            var count = await repo.CountAsync(spec);
            var products = await repo.ListAsync(spec);

            var data = _mapper.Map<IReadOnlyList<ProductDto>>(products);

            return new Pagination<ProductDto>
            {
                PageIndex = specParams.PageIndex,
                PageSize = specParams.PageSize,
                Count = count,
                Data = data
            };
        }

        public async Task<ProductDto?> GetProductByIdAsync(int productId)
        {
            var repo = _unitOfWork.Repository<Product>();

            var spec =
                new ProductWithBrandAndCategorySpecification(productId);

            var products = await repo.ListAsync(spec);

            var product = products.FirstOrDefault();

            if (product == null)
            {
                return null;
            }

            return _mapper.Map<ProductDto>(product);
        }

        public async Task<ProductDto?> UpdateProductAsync(
            int productId,
            UpdateProductDto updateProductDto)
        {
            var repo = _unitOfWork.Repository<Product>();

            var product = await repo.GetByIdAsync(productId);

            if (product == null)
            {
                return null;
            }

            _mapper.Map(updateProductDto, product);

            await repo.UpdateAsync(product);
            await _unitOfWork.SaveChangesAsync();

            return _mapper.Map<ProductDto>(product);
        }
    }
}