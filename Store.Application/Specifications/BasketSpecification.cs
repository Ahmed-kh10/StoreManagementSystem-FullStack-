using Store.Domain.Entities;

namespace Store.Application.Specifications
{
    public class BasketSpecification : BaseSpecification<Basket>
    {
        public BasketSpecification(string buyerId)
            : base(b => b.BuyerId == buyerId)
        {
            AddInclude(b => b.Items);
            AddInclude("Items.Product");
        }
    }
}