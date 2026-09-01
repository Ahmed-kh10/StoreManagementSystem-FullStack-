using Store.Domain.Entities;

namespace Store.Application.Specifications
{
    public class OrderPaymentIntentSpecification
        : BaseSpecification<Order>
    {
        public OrderPaymentIntentSpecification(string paymentIntentId)
            : base(o => o.PaymentIntentId == paymentIntentId)
        {
        }
    }
}