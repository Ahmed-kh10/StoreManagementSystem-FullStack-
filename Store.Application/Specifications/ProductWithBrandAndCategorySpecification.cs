using Store.Domain.Entities;

namespace Store.Application.Specifications
{
    public class ProductWithBrandAndCategorySpecification : BaseSpecification<Product>
    {

        public ProductWithBrandAndCategorySpecification(int productId)
            : base(p => p.Id == productId)
        {
            AddInclude(p => p.Brand);
            AddInclude(p => p.Category);
        }
    }
}