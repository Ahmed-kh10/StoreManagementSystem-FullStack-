using Store.Domain.Entities;

namespace Store.Application.Interfaces;

public interface ITokenService
{
    Task<string> CreateTokenAsync(AppUser user);
    string CreateRefreshToken();
}