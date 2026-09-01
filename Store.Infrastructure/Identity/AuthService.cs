using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Store.Application.DTOs.Auth;
using Store.Application.Interfaces;
using Store.Domain.Entities;

namespace Store.Infrastructure.Identity;

public class AuthService : IAuthService
{
    private readonly UserManager<AppUser> _userManager;
    private readonly SignInManager<AppUser> _signInManager;
    private readonly ITokenService _tokenService;
    private readonly ILogger<AuthService> _logger;

    public AuthService(
        UserManager<AppUser> userManager,
        SignInManager<AppUser> signInManager,
        ITokenService tokenService,
        ILogger<AuthService> logger)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _tokenService = tokenService;
        _logger = logger;
    }

    public async Task<AuthResponseDto> RegisterAsync(
        RegisterDto registerDto)
    {
        var user = new AppUser
        {
            DisplayName = registerDto.DisplayName,
            Email = registerDto.Email,
            UserName = registerDto.Email
        };

        var result = await _userManager.CreateAsync(
            user,
            registerDto.Password);

        if (!result.Succeeded)
        {
            var errors = string.Join(
                ", ",
                result.Errors.Select(e => e.Description));

            _logger.LogWarning(
                "User registration failed for {Email}",
                registerDto.Email);

            throw new ArgumentException(errors);
        }

        var accessToken =
            await _tokenService.CreateTokenAsync(user);

        var refreshToken =
            _tokenService.CreateRefreshToken();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime =
            DateTime.UtcNow.AddDays(7);

        await _userManager.UpdateAsync(user);

        _logger.LogInformation(
            "User registered successfully: {Email}",
            user.Email);

        return new AuthResponseDto
        {
            DisplayName = user.DisplayName,
            Email = user.Email!,
            Token = accessToken,
            RefreshToken = refreshToken
        };
    }

    public async Task<AuthResponseDto> LoginAsync(
        LoginDto loginDto)
    {
        _logger.LogInformation(
            "Login attempt for: {Email}",
            loginDto.Email);

        var user =
            await _userManager.FindByEmailAsync(
                loginDto.Email);

        if (user == null)
        {
            _logger.LogWarning(
                "Login failed - user not found: {Email}",
                loginDto.Email);

            throw new UnauthorizedAccessException(
                "Invalid email or password");
        }

        var result =
            await _signInManager.CheckPasswordSignInAsync(
                user,
                loginDto.Password,
                false);

        if (!result.Succeeded)
        {
            _logger.LogWarning(
                "Login failed - invalid password: {Email}",
                loginDto.Email);

            throw new UnauthorizedAccessException(
                "Invalid email or password");
        }

        var accessToken =
            await _tokenService.CreateTokenAsync(user);

        var refreshToken =
            _tokenService.CreateRefreshToken();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime =
            DateTime.UtcNow.AddDays(7);

        await _userManager.UpdateAsync(user);

        _logger.LogInformation(
            "User logged in successfully: {Email}",
            user.Email);

        return new AuthResponseDto
        {
            DisplayName = user.DisplayName,
            Email = user.Email!,
            Token = accessToken,
            RefreshToken = refreshToken
        };
    }

    public async Task<AuthResponseDto?> RefreshTokenAsync(
        string refreshToken)
    {
        var user =
            _userManager.Users.FirstOrDefault(
                u => u.RefreshToken == refreshToken);

        if (user == null)
        {
            _logger.LogWarning(
                "Refresh token attempt failed.");

            return null;
        }

        if (!user.RefreshTokenExpiryTime.HasValue ||
            user.RefreshTokenExpiryTime.Value <=
                DateTime.UtcNow)
        {
            _logger.LogWarning(
                "Expired refresh token attempt for user {UserId}",
                user.Id);

            return null;
        }

        var newAccessToken =
            await _tokenService.CreateTokenAsync(user);

        var newRefreshToken =
            _tokenService.CreateRefreshToken();

        user.RefreshToken = newRefreshToken;
        user.RefreshTokenExpiryTime =
            DateTime.UtcNow.AddDays(7);

        await _userManager.UpdateAsync(user);

        _logger.LogInformation(
            "Refresh token successfully rotated for user {UserId}",
            user.Id);

        return new AuthResponseDto
        {
            DisplayName = user.DisplayName,
            Email = user.Email!,
            Token = newAccessToken,
            RefreshToken = newRefreshToken
        };
    }

    public async Task<bool> LogoutAsync(string userId)
    {
        var user =
            await _userManager.FindByIdAsync(userId);

        if (user == null)
        {
            _logger.LogWarning(
                "Logout failed - user not found: {UserId}",
                userId);

            return false;
        }

        user.RefreshToken = null;
        user.RefreshTokenExpiryTime = null;

        await _userManager.UpdateAsync(user);

        _logger.LogInformation(
            "User logged out successfully: {UserId}",
            userId);

        return true;
    }
}