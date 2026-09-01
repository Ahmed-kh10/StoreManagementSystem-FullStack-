namespace Store.Application.Interfaces
{
    public interface IPaymentService
    {
        Task<string> CreatePaymentIntentAsync(int orderId,string buyerId);

        Task<bool> UpdateOrderPaymentSucceededAsync(string paymentIntentId);

        Task<bool> UpdateOrderPaymentFailedAsync(string paymentIntentId);
    }
}