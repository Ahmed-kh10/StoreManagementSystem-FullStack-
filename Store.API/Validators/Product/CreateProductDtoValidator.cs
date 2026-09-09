using FluentValidation;
using Store.Application.DTOs.Products;

namespace Store.Application.Validators.Products
{
    public class CreateProductDtoValidator : AbstractValidator<CreateProductDto>
    {
        public CreateProductDtoValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Product name is required.")
                .MaximumLength(100).WithMessage("Product name cannot exceed 100 characters.")
                .MinimumLength(3).WithMessage("Product name must be at least 3 characters long.");

            RuleFor(x => x.Price)
                .GreaterThan(0).WithMessage("Price must be greater than 0.");

            RuleFor(x => x.Stock)
                .GreaterThanOrEqualTo(0).WithMessage("Stock cannot be negative.");

            RuleFor(x => x.ImageUrl)
                .NotEmpty().WithMessage("Image URL is required.");

            RuleFor(x => x.BrandId)
                .GreaterThan(0).WithMessage("Please select a valid brand.");

            RuleFor(x => x.CategoryId)
                .GreaterThan(0).WithMessage("Please select a valid category.");
        }
    }
}