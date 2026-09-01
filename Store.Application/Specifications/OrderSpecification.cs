using Store.Domain.Entities;

namespace Store.Application.Specifications
{
    public class OrderSpecification
        : BaseSpecification<Order>
    {
        public OrderSpecification(
            string buyerId)
            : base(o => o.BuyerId == buyerId)
        {
            AddInclude(o => o.Items);
        }

        public OrderSpecification(
            int orderId,
            string buyerId)
            : base(o =>
                o.Id == orderId &&
                o.BuyerId == buyerId)
        {
            AddInclude(o => o.Items);
        }
    }
}