namespace Store.Domain.Entities
{
    public enum OrderStatus
    {
        Pending,
        PaymentReceived,
        Processing,
        Shipped,
        Delivered,
        Cancelled
    }
}
