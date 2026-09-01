namespace Store.Application.DTOs.Auth
{
    public class AuthResponseDto
    {
        public string DisplayName { get; set; } = default!;
        public string Email { get; set; } = default!;
        public string Token { get; set; } = default!;
        public string RefreshToken { get; set; } = default!;
    }
}