using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Store.Application.Interfaces;

namespace Store.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentsController : ControllerBase
    {
        private readonly IPaymentService _paymentService;
        private readonly IUserService _userService;

        public PaymentsController(
            IPaymentService paymentService,
            IUserService userService)
        {
            _paymentService = paymentService;
            _userService = userService;
        }

        [HttpPost("{orderId}")]
        public async Task<IActionResult>
            CreatePaymentIntent(int orderId)
        {
            var buyerId =
                _userService.GetUserId();

            var clientSecret =
                await _paymentService
                    .CreatePaymentIntentAsync(
                        orderId,
                        buyerId);

            return Ok(new
            {
                clientSecret
            });
        }
    }
}