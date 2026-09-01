using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Store.Application.DTOs.Orders;
using Store.Application.Interfaces;

namespace Store.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;
        private readonly IUserService _userService;

        public OrdersController(
            IOrderService orderService,
            IUserService userService)
        {
            _orderService = orderService;
            _userService = userService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrder(
            CreateOrderDto dto)
        {
            var buyerId =
                _userService.GetUserId();

            var order =
                await _orderService.CreateOrderAsync(
                    buyerId,
                    dto);

            return Ok(order);
        }

        [HttpGet]
        public async Task<IActionResult> GetOrders()
        {
            var buyerId =
                _userService.GetUserId();

            var orders =
                await _orderService.GetOrdersAsync(
                    buyerId);

            return Ok(orders);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrder(
            int id)
        {
            var buyerId =
                _userService.GetUserId();

            var order =
                await _orderService.GetOrderByIdAsync(
                    id,
                    buyerId);

            if (order == null)
            {
                return NotFound();
            }

            return Ok(order);
        }
    }
}