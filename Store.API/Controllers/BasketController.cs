using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Store.Application.DTOs.Baskets;
using Store.Application.Interfaces;

namespace Store.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class BasketController : ControllerBase
    {
        private readonly IBasketService _basketService;
        private readonly IUserService _userService;

        public BasketController(
            IBasketService basketService,
            IUserService userService)
        {
            _basketService = basketService;
            _userService = userService;
        }

        // GET: api/Basket
        [HttpGet]
        public async Task<IActionResult> GetBasket()
        {
            var buyerId = _userService.GetUserId();

            var basket =
                await _basketService.GetBasketAsync(buyerId);

            if (basket == null)
            {
                return NotFound();
            }

            return Ok(basket);
        }

        // POST: api/Basket
        [HttpPost]
        public async Task<IActionResult> CreateOrUpdateBasket(
            [FromBody] BasketDto basket)
        {
            var buyerId = _userService.GetUserId();

            var updatedBasket =
                await _basketService.CreateOrUpdateBasketAsync(
                    buyerId,
                    basket);

            return Ok(updatedBasket);
        }

        // DELETE: api/Basket
        [HttpDelete]
        public async Task<IActionResult> DeleteBasket()
        {
            var buyerId = _userService.GetUserId();

            var result =
                await _basketService.DeleteBasketAsync(buyerId);

            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}