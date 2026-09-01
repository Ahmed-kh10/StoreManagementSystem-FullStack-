using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Store.API.Middleware;
using Store.Application.Interfaces;
using Store.Application.Mapping;
using Store.Application.Services;
using Store.Application.Settings;
using Store.Application.Validators.Products;
using Store.Domain.Entities;
using Store.Infrastructure.Data;
using Store.Infrastructure.Identity;
using Store.Infrastructure.Repositories;
using Store.Infrastructure.Services;
using System.Text;

namespace Store.API;

public class Program
{
    public static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // =========================
        // Local Configuration
        // =========================
        builder.Configuration.AddJsonFile(
            "appsettings.Local.json",
            optional: true,
            reloadOnChange: true);

        // =========================
        // Controllers
        // =========================
        builder.Services.AddControllers();

        // =========================
        // Unified Validation Error Response
        // =========================
        builder.Services.Configure<ApiBehaviorOptions>(options =>
        {
            options.InvalidModelStateResponseFactory = context =>
            {
                var errorMessage = context.ModelState
                    .Where(e => e.Value?.Errors.Count > 0)
                    .SelectMany(e => e.Value!.Errors)
                    .Select(e => e.ErrorMessage)
                    .FirstOrDefault()
                    ?? "البيانات المرسلة غير صحيحة.";

                var problem = new ProblemDetails
                {
                    Status = StatusCodes.Status400BadRequest,
                    Title = "Bad Request",
                    Detail = errorMessage,
                    Instance = context.HttpContext.Request.Path
                };

                problem.Extensions["traceId"] =
                    context.HttpContext.TraceIdentifier;

                return new BadRequestObjectResult(problem);
            };
        });

        // =========================
        // Swagger
        // =========================
        builder.Services.AddEndpointsApiExplorer();

        builder.Services.AddSwaggerGen(options =>
        {
            options.AddSecurityDefinition(
                "Bearer",
                new Microsoft.OpenApi.Models.OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
                    Scheme = "bearer",
                    BearerFormat = "JWT",
                    In = Microsoft.OpenApi.Models.ParameterLocation.Header,
                    Description =
                        "Enter your JWT token like this: Bearer {your-token}"
                });

            options.AddSecurityRequirement(
                new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
                {
                    {
                        new Microsoft.OpenApi.Models.OpenApiSecurityScheme
                        {
                            Reference =
                                new Microsoft.OpenApi.Models.OpenApiReference
                                {
                                    Type =
                                        Microsoft.OpenApi.Models.ReferenceType
                                            .SecurityScheme,

                                    Id = "Bearer"
                                }
                        },

                        Array.Empty<string>()
                    }
                });
        });

        // =========================
        // Database
        // =========================
        builder.Services.AddDbContext<StoreDbContext>(options =>
            options.UseSqlServer(
                builder.Configuration.GetConnectionString(
                    "DefaultConnection")));

        // =========================
        // Health Checks
        // =========================
        builder.Services
            .AddHealthChecks()
            .AddDbContextCheck<StoreDbContext>();

        // =========================
        // CORS
        // =========================
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowFrontend", policy =>
            {
                policy
                    .WithOrigins(
                        "http://localhost:3000",
                        "https://localhost:3000")
                    .AllowAnyHeader()
                    .AllowAnyMethod();
            });
        });

        // =========================
        // Rate Limiting
        // =========================
        builder.Services.AddRateLimiter(options =>
        {
            options.RejectionStatusCode =
                StatusCodes.Status429TooManyRequests;

            options.AddFixedWindowLimiter(
                "fixed",
                limiterOptions =>
                {
                    limiterOptions.PermitLimit = 100;

                    limiterOptions.Window =
                        TimeSpan.FromMinutes(1);

                    limiterOptions.QueueLimit = 0;
                });
        });

        // =========================
        // HTTP Logging
        // =========================
        builder.Services.AddHttpLogging(options =>
        {
            options.LoggingFields =
                Microsoft.AspNetCore.HttpLogging.HttpLoggingFields
                    .RequestProperties;
        });

        // =========================
        // JWT Settings
        // =========================
        var jwtSettings =
            builder.Configuration
                .GetSection("JwtSettings")
                .Get<JwtSettings>()
            ?? throw new InvalidOperationException(
                "JwtSettings configuration is missing.");

        builder.Services.AddSingleton(jwtSettings);

        // =========================
        // Stripe Settings
        // =========================
        var stripeSettings =
            builder.Configuration
                .GetSection("StripeSettings")
                .Get<StripeSettings>()
            ?? throw new InvalidOperationException(
                "StripeSettings configuration is missing.");

        builder.Services.AddSingleton(stripeSettings);

        // =========================
        // Identity
        // =========================
        builder.Services
            .AddIdentityCore<AppUser>(options =>
            {
                options.User.RequireUniqueEmail = true;

                options.Password.RequireDigit = true;
                options.Password.RequireLowercase = true;
                options.Password.RequireUppercase = true;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequiredLength = 6;
            })
            .AddRoles<IdentityRole>()
            .AddEntityFrameworkStores<StoreDbContext>()
            .AddSignInManager()
            .AddDefaultTokenProviders();

        // =========================
        // Authentication
        // =========================
        builder.Services
            .AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme =
                    JwtBearerDefaults.AuthenticationScheme;

                options.DefaultChallengeScheme =
                    JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters =
                    new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,

                        IssuerSigningKey =
                            new SymmetricSecurityKey(
                                Encoding.UTF8.GetBytes(
                                    jwtSettings.Key)),

                        ValidateIssuer = true,
                        ValidIssuer = jwtSettings.Issuer,

                        ValidateAudience = true,
                        ValidAudience = jwtSettings.Audience,

                        ValidateLifetime = true,

                        ClockSkew = TimeSpan.Zero
                    };
            });

        // =========================
        // Authorization
        // =========================
        builder.Services.AddAuthorization();

        // =========================
        // Exception Handling
        // =========================
        builder.Services.AddExceptionHandler<ExceptionMiddleware>();
        builder.Services.AddProblemDetails();

        // =========================
        // Authentication Services
        // =========================
        builder.Services.AddScoped<IAuthService, AuthService>();
        builder.Services.AddScoped<ITokenService, TokenService>();

        // =========================
        // AutoMapper
        // =========================
        builder.Services.AddAutoMapper(
            typeof(MappingProfile));

        // =========================
        // Repositories / Unit Of Work
        // =========================
        builder.Services.AddScoped<
            IUnitOfWork,
            UnitOfWork>();

        builder.Services.AddScoped(
            typeof(IGenericRepository<>),
            typeof(GenericRepository<>));

        // =========================
        // Application Services
        // =========================
        builder.Services.AddScoped<
            IProductService,
            ProductService>();

        builder.Services.AddScoped<
            IBasketService,
            BasketService>();

        builder.Services.AddScoped<
            IOrderService,
            OrderService>();

        builder.Services.AddScoped<
            IPaymentService,
            PaymentService>();

        // =========================
        // User Service
        // =========================
        builder.Services.AddHttpContextAccessor();

        builder.Services.AddScoped<
            IUserService,
            UserService>();

        // =========================
        // FluentValidation
        // =========================
        builder.Services.AddFluentValidationAutoValidation();

        builder.Services.AddValidatorsFromAssemblyContaining<
            CreateProductDtoValidator>();

        // =========================
        // Build Application
        // =========================
        var app = builder.Build();

        // =========================
        // Database Seeder
        // =========================
        using (var scope = app.Services.CreateScope())
        {
            var services = scope.ServiceProvider;

            var roleManager =
                services.GetRequiredService<
                    RoleManager<IdentityRole>>();

            var userManager =
                services.GetRequiredService<
                    UserManager<AppUser>>();

            var context =
                services.GetRequiredService<
                    StoreDbContext>();

            await DbInitializer.InitializeAsync(context);

            await IdentitySeeder.SeedRolesAsync(
                roleManager);

            await IdentitySeeder.SeedAdminAsync(
                userManager);
        }

        // =========================
        // Swagger
        // =========================
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        // =========================
        // Exception Handling
        // =========================
        app.UseExceptionHandler();

        // =========================
        // HTTPS
        // =========================
        app.UseHttpsRedirection();

        // =========================
        // CORS
        // =========================
        app.UseCors("AllowFrontend");

        // =========================
        // HTTP Logging
        // =========================
        app.UseHttpLogging();

        // =========================
        // Authentication
        // =========================
        app.UseAuthentication();

        // =========================
        // Authorization
        // =========================
        app.UseAuthorization();

        // =========================
        // Rate Limiting
        // =========================
        app.UseRateLimiter();

        // =========================
        // Health Check
        // =========================
        app.MapHealthChecks("/health");

        // =========================
        // Controllers
        // =========================
        app.MapControllers()
            .RequireRateLimiting("fixed");

        // =========================
        // Run
        // =========================
        await app.RunAsync();
    }
}