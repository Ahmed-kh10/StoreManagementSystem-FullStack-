using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Store.Domain.Entities;

namespace Store.Infrastructure.Configurations
{
    public class BasketConfiguration :
        IEntityTypeConfiguration<Basket>
    {
        public void Configure(
            EntityTypeBuilder<Basket> builder)
        {
            builder.HasKey(b => b.Id);

            builder.Property(b => b.BuyerId)
                .IsRequired();

            builder.HasIndex(b => b.BuyerId)
                .IsUnique();

            builder.HasMany(b => b.Items)
                .WithOne(bi => bi.Basket)
                .HasForeignKey(bi => bi.BasketId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}