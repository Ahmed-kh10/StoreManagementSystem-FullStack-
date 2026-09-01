using AutoMapper;
using Store.Application.DTOs.Orders;
using Store.Application.Interfaces;
using Store.Application.Specifications;
using Store.Domain.Entities;

namespace Store.Application.Services
{
    public class OrderService : IOrderService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public OrderService(
            IUnitOfWork unitOfWork,
            IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<OrderDto> CreateOrderAsync(
            string buyerId,
            CreateOrderDto dto)
        {
            var basketRepo =
                _unitOfWork.Repository<Basket>();

            var basketSpec =
                new BasketSpecification(buyerId);

            var baskets =
                await basketRepo.ListAsync(basketSpec);

            var basket =
                baskets.FirstOrDefault();

            if (basket == null ||
                !basket.Items.Any())
            {
                throw new InvalidOperationException(
                    "Basket is empty.");
            }

            var order = new Order
            {
                BuyerId = buyerId,
                OrderDate = DateTime.UtcNow,
                Status = OrderStatus.Pending,
                PaymentStatus = "Pending",
                ShippingPrice = 0,
                ShippingAddress = new Address
                {
                    FirstName =
                        dto.ShippingAddress.FirstName,

                    LastName =
                        dto.ShippingAddress.LastName,

                    Street =
                        dto.ShippingAddress.Street,

                    City =
                        dto.ShippingAddress.City,

                    State =
                        dto.ShippingAddress.State,

                    ZipCode =
                        dto.ShippingAddress.ZipCode
                }
            };

            foreach (var basketItem in basket.Items)
            {
                if (basketItem.Product == null)
                {
                    throw new InvalidOperationException(
                        "Product was not found.");
                }

                var price =
                    basketItem.Product.Price;

                var total =
                    price * basketItem.Quantity;

                order.Items.Add(
                    new OrderItem
                    {
                        ProductId =
                            basketItem.ProductId,

                        ProductName =
                            basketItem.Product.Name!,

                        Price = price,

                        Quantity =
                            basketItem.Quantity,

                        Total = total
                    });
            }

            order.Subtotal =
                order.Items.Sum(x => x.Total);

            order.Total =
                order.Subtotal +
                order.ShippingPrice;

            var orderRepo =
                _unitOfWork.Repository<Order>();

            await orderRepo.AddAsync(order);

            await _unitOfWork.SaveChangesAsync();

            return _mapper.Map<OrderDto>(order);
        }

        public async Task<IReadOnlyList<OrderDto>>
            GetOrdersAsync(string buyerId)
        {
            var repo =
                _unitOfWork.Repository<Order>();

            var spec =
                new OrderSpecification(buyerId);

            var orders =
                await repo.ListAsync(spec);

            return _mapper.Map<
                IReadOnlyList<OrderDto>>(orders);
        }

        public async Task<OrderDto?>
            GetOrderByIdAsync(
                int orderId,
                string buyerId)
        {
            var repo =
                _unitOfWork.Repository<Order>();

            var spec =
                new OrderSpecification(
                    orderId,
                    buyerId);

            var orders =
                await repo.ListAsync(spec);

            var order =
                orders.FirstOrDefault();

            return order == null
                ? null
                : _mapper.Map<OrderDto>(order);
        }
    }
}