namespace Store.Domain.Entities
{
    public class Basket : BaseEntity
    {        public string BuyerId { get; set; } = default!;
        public ICollection<BasketItem> Items { get; set; } = new List<BasketItem>();
    }
}
