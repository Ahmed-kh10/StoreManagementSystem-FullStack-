using AutoMapper;
using Store.Application.DTOs.Baskets;
using Store.Application.DTOs.Brands;
using Store.Application.DTOs.Categories;
using Store.Application.DTOs.Orders;
using Store.Application.DTOs.Products;
using Store.Domain.Entities;

namespace Store.Application.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Product
            CreateMap<Product, ProductDto>()
                .ForMember(
                    dest => dest.BrandName,
                    opt => opt.MapFrom(src => src.Brand.Name))
                .ForMember(
                    dest => dest.CategoryName,
                    opt => opt.MapFrom(src => src.Category.Name));

            CreateMap<CreateProductDto, Product>();

            CreateMap<Brand, BrandDto>();
            CreateMap<Category, CategoryDto>();

            CreateMap<UpdateProductDto, Product>();

            // Basket
            CreateMap<Basket, BasketDto>();

            CreateMap<BasketDto, Basket>();

            CreateMap<BasketItem, BasketItemDto>()
                .ForMember(
                    dest => dest.Name,
                    opt => opt.MapFrom(src => src.Product.Name))
                .ForMember(
                    dest => dest.Price,
                    opt => opt.MapFrom(src => src.Product.Price))
                .ForMember(
                    dest => dest.ImageUrl,
                    opt => opt.MapFrom(src => src.Product.ImageUrl));

            CreateMap<BasketItemDto, BasketItem>()
                .ForMember(
                    dest => dest.Basket,
                    opt => opt.Ignore())
                .ForMember(
                    dest => dest.Product,
                    opt => opt.Ignore())
                .ForMember(
                    dest => dest.BasketId,
                    opt => opt.Ignore());


            CreateMap<Order, OrderDto>()
                .ForMember(
                    d => d.Status,
                    o => o.MapFrom(s => s.Status.ToString()));

            CreateMap<OrderItem, OrderItemDto>();

            CreateMap<Address, AddressDto>();

            CreateMap<AddressDto, Address>();
        }
    }
}