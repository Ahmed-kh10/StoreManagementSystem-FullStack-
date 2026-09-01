using AutoMapper;
using Store.Application.DTOs.Baskets;
using Store.Application.Interfaces;
using Store.Application.Specifications;
using Store.Domain.Entities;

namespace Store.Application.Services
{
    public class BasketService : IBasketService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public BasketService(
            IUnitOfWork unitOfWork,
            IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<BasketDto> CreateOrUpdateBasketAsync(
            string buyerId,
            BasketDto basketDto)
        {
            if (string.IsNullOrWhiteSpace(buyerId))
            {
                throw new UnauthorizedAccessException(
                    "User is not authenticated.");
            }

            var basketRepository =
                _unitOfWork.Repository<Basket>();

            var basketSpecification =
                new BasketSpecification(buyerId);

            var baskets =
                await basketRepository.ListAsync(
                    basketSpecification);

            var existingBasket =
                baskets.FirstOrDefault();

            // =========================
            // CREATE
            // =========================

            if (existingBasket == null)
            {
                var newBasket = new Basket
                {
                    BuyerId = buyerId
                };

                foreach (var item in basketDto.Items)
                {
                    newBasket.Items.Add(
                        new BasketItem
                        {
                            ProductId = item.ProductId,
                            Quantity = item.Quantity
                        });
                }

                await basketRepository.AddAsync(newBasket);

                await _unitOfWork.SaveChangesAsync();

                return _mapper.Map<BasketDto>(newBasket);
            }

            // =========================
            // UPDATE
            // =========================

            existingBasket.Items.Clear();

            foreach (var item in basketDto.Items)
            {
                existingBasket.Items.Add(
                    new BasketItem
                    {
                        BasketId = existingBasket.Id,
                        ProductId = item.ProductId,
                        Quantity = item.Quantity
                    });
            }

            await _unitOfWork.SaveChangesAsync();

            return _mapper.Map<BasketDto>(
                existingBasket);
        }

        public async Task<BasketDto?> GetBasketAsync(
            string buyerId)
        {
            if (string.IsNullOrWhiteSpace(buyerId))
            {
                throw new UnauthorizedAccessException(
                    "User is not authenticated.");
            }

            var basketRepository =
                _unitOfWork.Repository<Basket>();

            var basketSpecification =
                new BasketSpecification(buyerId);

            var baskets =
                await basketRepository.ListAsync(
                    basketSpecification);

            var basket =
                baskets.FirstOrDefault();

            if (basket == null)
            {
                return null;
            }

            return _mapper.Map<BasketDto>(basket);
        }

        public async Task<bool> DeleteBasketAsync(
            string buyerId)
        {
            if (string.IsNullOrWhiteSpace(buyerId))
            {
                throw new UnauthorizedAccessException(
                    "User is not authenticated.");
            }

            var basketRepository =
                _unitOfWork.Repository<Basket>();

            var basketSpecification =
                new BasketSpecification(buyerId);

            var baskets =
                await basketRepository.ListAsync(
                    basketSpecification);

            var basket =
                baskets.FirstOrDefault();

            if (basket == null)
            {
                return false;
            }

            await basketRepository.DeleteAsync(
                basket.Id);

            await _unitOfWork.SaveChangesAsync();

            return true;
        }
    }
}