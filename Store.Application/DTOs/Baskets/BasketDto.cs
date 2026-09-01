namespace Store.Application.DTOs.Baskets
{
    public class BasketDto
    {
        public int Id { get; set; }
        public List<BasketItemDto> Items { get; set; } = new();
    }
}