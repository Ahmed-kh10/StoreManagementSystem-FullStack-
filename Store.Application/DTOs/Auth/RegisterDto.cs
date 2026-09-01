namespace Store.Application.DTOs.Auth
{
    public class RegisterDto
    {
        public string DisplayName { get; set; } = default!;
        public string Email { get; set; } = default!;
        public string Password { get; set; } = default!;
    }
}