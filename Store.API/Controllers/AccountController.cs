using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Store.Application.DTOs.Auth;
using Store.Application.Interfaces;

namespace Store.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IAuthService _authService;

        public AccountController(
            IUserService userService,
            IAuthService authService)
        {
            _userService = userService;
            _authService = authService;
        }

        [HttpGet("current-user")]
        public IActionResult GetCurrentUser()
        {
            var userId = _userService.GetUserId();
            var email = _userService.GetUserEmail();

            return Ok(new
            {
                userId,
                email
            });
        }

        [AllowAnonymous]
        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken(
            [FromBody] RefreshTokenDto dto)
        {
            var result = await _authService.RefreshTokenAsync(
                dto.RefreshToken);

            if (result == null)
            {
                throw new UnauthorizedAccessException(
                    "Invalid or expired refresh token");
            }

            return Ok(result);
        }

        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var userId = _userService.GetUserId();

            var result =
                await _authService.LogoutAsync(userId);

            if (!result)
            {
                throw new KeyNotFoundException(
                    "User not found");
            }

            return NoContent();
        }
    }
}