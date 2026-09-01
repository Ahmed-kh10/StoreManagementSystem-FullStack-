using Store.Application.Interfaces;
using Store.Application.Settings;
using Store.Application.Specifications;
using Store.Domain.Entities;
using Stripe;

namespace Store.Infrastructure.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly StripeSettings _settings;

        public PaymentService(
            IUnitOfWork unitOfWork,
            StripeSettings settings)
        {
            _unitOfWork = unitOfWork;
            _settings = settings;
        }

        public async Task<string> CreatePaymentIntentAsync(
            int orderId,
            string buyerId)
        {
            StripeConfiguration.ApiKey = _settings.SecretKey;

            var orderRepository = _unitOfWork.Repository<Order>();

            var orders = await orderRepository.ListAsync(
                new OrderSpecification(orderId, buyerId));

            var order = orders.FirstOrDefault();

            if (order == null)
            {
                throw new KeyNotFoundException(
                    "Order not found.");
            }

            if (order.PaymentStatus == "Paid")
            {
                throw new InvalidOperationException(
                    "Order is already paid.");
            }

            var options = new PaymentIntentCreateOptions
            {
                Amount = (long)(order.Total * 100),
                Currency = "usd",

                AutomaticPaymentMethods =
                    new PaymentIntentAutomaticPaymentMethodsOptions
                    {
                        Enabled = true
                    },

                Metadata = new Dictionary<string, string>
                {
                    ["orderId"] = order.Id.ToString(),
                    ["buyerId"] = buyerId
                }
            };

            var service = new PaymentIntentService();

            var paymentIntent =
                await service.CreateAsync(options);

            order.PaymentIntentId = paymentIntent.Id;
            order.PaymentStatus = "Pending";

            await _unitOfWork.SaveChangesAsync();

            return paymentIntent.ClientSecret;
        }

        public async Task<bool> UpdateOrderPaymentSucceededAsync(
            string paymentIntentId)
        {
            var orderRepository =
                _unitOfWork.Repository<Order>();

            var orders = await orderRepository.ListAsync(
                new OrderPaymentIntentSpecification(
                    paymentIntentId));

            var order = orders.FirstOrDefault();

            if (order == null)
            {
                return false;
            }

            order.PaymentStatus = "Paid";
            order.Status = OrderStatus.PaymentReceived;

            await _unitOfWork.SaveChangesAsync();

            return true;
        }

        public async Task<bool> UpdateOrderPaymentFailedAsync(
            string paymentIntentId)
        {
            var orderRepository =
                _unitOfWork.Repository<Order>();

            var orders = await orderRepository.ListAsync(
                new OrderPaymentIntentSpecification(
                    paymentIntentId));

            var order = orders.FirstOrDefault();

            if (order == null)
            {
                return false;
            }

            order.PaymentStatus = "Failed";

            await _unitOfWork.SaveChangesAsync();

            return true;
        }
    }
}