using Store.Application.DTOs.Baskets;

namespace Store.Application.Interfaces
{
    public interface IBasketService
    {
        Task<BasketDto?> GetBasketAsync(string BuyerId);
        Task<BasketDto> CreateOrUpdateBasketAsync(string buyerId, BasketDto basket);
        Task<bool> DeleteBasketAsync(string BuyerId);
    }
}
