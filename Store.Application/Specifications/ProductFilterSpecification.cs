using Store.Application.DTOs.Products;
using Store.Domain.Entities;

namespace Store.Application.Specifications
{
    public class ProductFilterSpecification
        : BaseSpecification<Product>
    {
        public ProductFilterSpecification(
            ProductSpecParams specParams)
            : base(p => true)
        {
            AddInclude(p => p.Brand);
            AddInclude(p => p.Category);

            Criteria = p =>
                (
                    string.IsNullOrEmpty(specParams.Search)
                    ||
                    p.Name.Contains(specParams.Search)
                    ||
                    (
                        p.Description != null &&
                        p.Description.Contains(specParams.Search)
                    )
                )
                &&
                (
                    !specParams.BrandId.HasValue ||
                    p.BrandId == specParams.BrandId.Value
                )
                &&
                (
                    !specParams.CategoryId.HasValue ||
                    p.CategoryId == specParams.CategoryId.Value
                )
                &&
                (
                    !specParams.MinPrice.HasValue ||
                    p.Price >= specParams.MinPrice.Value
                )
                &&
                (
                    !specParams.MaxPrice.HasValue ||
                    p.Price <= specParams.MaxPrice.Value
                );

            if (!string.IsNullOrEmpty(specParams.Sort))
            {
                switch (specParams.Sort)
                {
                    case "priceAsc":
                        OrderBy = p => p.Price;
                        break;

                    case "priceDesc":
                        OrderByDescending = p => p.Price;
                        break;
                }
            }

            if (specParams.PageIndex > 0 &&
                specParams.PageSize > 0)
            {
                Skip =
                    (specParams.PageIndex - 1)
                    * specParams.PageSize;

                Take = specParams.PageSize;
            }
        }
    }
}