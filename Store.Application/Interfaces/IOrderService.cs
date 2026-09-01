using Store.Application.DTOs.Orders;

namespace Store.Application.Interfaces
{
    public interface IOrderService
    {
        Task<OrderDto> CreateOrderAsync(string buyerId,CreateOrderDto dto);
        Task<IReadOnlyList<OrderDto>> GetOrdersAsync(string buyerId);
        Task<OrderDto?> GetOrderByIdAsync(int orderId,string buyerId);
    }
}