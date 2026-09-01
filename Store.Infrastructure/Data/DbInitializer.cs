using Microsoft.EntityFrameworkCore;
using Store.Domain.Entities;

namespace Store.Infrastructure.Data;

public static class DbInitializer
{
    public static async Task InitializeAsync(StoreDbContext context)
    {
        // Apply pending migrations
        await context.Database.MigrateAsync();

        // =========================
        // Brands
        // =========================

        if (!await context.Brands.AnyAsync())
        {
            context.Brands.AddRange(
                new Brand
                {
                    Name = "Apple"
                },
                new Brand
                {
                    Name = "Samsung"
                },
                new Brand
                {
                    Name = "Dell"
                }
            );

            await context.SaveChangesAsync();
        }

        // =========================
        // Categories
        // =========================

        if (!await context.Categories.AnyAsync())
        {
            context.Categories.AddRange(
                new Category
                {
                    Name = "Smart Phones"
                },
                new Category
                {
                    Name = "Laptops"
                },
                new Category
                {
                    Name = "Accessories"
                }
            );

            await context.SaveChangesAsync();
        }

        // =========================
        // Products
        // =========================

        if (!await context.Products.AnyAsync())
        {
            var apple = await context.Brands
                .FirstAsync(x => x.Name == "Apple");

            var samsung = await context.Brands
                .FirstAsync(x => x.Name == "Samsung");

            var dell = await context.Brands
                .FirstAsync(x => x.Name == "Dell");

            var phones = await context.Categories
                .FirstAsync(x => x.Name == "Smart Phones");

            var laptops = await context.Categories
                .FirstAsync(x => x.Name == "Laptops");

            var accessories = await context.Categories
                .FirstAsync(x => x.Name == "Accessories");

            context.Products.AddRange(
                new Product
                {
                    Name = "iPhone 15",
                    Description = "Apple iPhone 15",
                    Price = 799,
                    Stock = 20,
                    ImageUrl = "https://example.com/iphone15.jpg",
                    BrandId = apple.Id,
                    CategoryId = phones.Id
                },

                new Product
                {
                    Name = "Galaxy S24",
                    Description = "Samsung Galaxy S24",
                    Price = 699,
                    Stock = 25,
                    ImageUrl = "https://example.com/galaxys24.jpg",
                    BrandId = samsung.Id,
                    CategoryId = phones.Id
                },

                new Product
                {
                    Name = "MacBook Air",
                    Description = "Apple MacBook Air",
                    Price = 1099,
                    Stock = 10,
                    ImageUrl = "https://example.com/macbook.jpg",
                    BrandId = apple.Id,
                    CategoryId = laptops.Id
                },

                new Product
                {
                    Name = "Dell XPS 15",
                    Description = "Dell XPS 15 Laptop",
                    Price = 1299,
                    Stock = 8,
                    ImageUrl = "https://example.com/dell-xps.jpg",
                    BrandId = dell.Id,
                    CategoryId = laptops.Id
                },

                new Product
                {
                    Name = "USB-C Charger",
                    Description = "Fast USB-C Charger",
                    Price = 29,
                    Stock = 50,
                    ImageUrl = "https://example.com/charger.jpg",
                    BrandId = apple.Id,
                    CategoryId = accessories.Id
                }
            );

            await context.SaveChangesAsync();
        }
    }
}