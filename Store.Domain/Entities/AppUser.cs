using Microsoft.AspNetCore.Identity;

namespace Store.Domain.Entities
{
    public class AppUser : IdentityUser
    {
        public string DisplayName { get; set; } = default!;
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiryTime { get; set; }
    }
}