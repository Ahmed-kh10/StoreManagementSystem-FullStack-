using System.Linq.Expressions;

namespace Store.Application.Specifications
{
    public class BaseSpecification<T> : ISpecification<T>
    {
        private readonly List<Expression<Func<T, object>>> _includes = new();
        private readonly List<string> _includeStrings = new();

        public BaseSpecification(
            Expression<Func<T, bool>> criteria,
            int? pageIndex = null,
            int? pageSize = null)
        {
            Criteria = criteria;

            if (pageIndex.HasValue && pageSize.HasValue)
            {
                Skip = (pageIndex.Value - 1) * pageSize.Value;
                Take = pageSize.Value;
            }
        }

        public Expression<Func<T, bool>> Criteria { get; protected set; }

        public IReadOnlyList<Expression<Func<T, object>>> Includes =>
            _includes;

        public IReadOnlyList<string> IncludeStrings =>
            _includeStrings;

        public int? Skip { get; protected set; }

        public int? Take { get; protected set; }

        public Expression<Func<T, object>>? OrderBy { get; protected set; }

        public Expression<Func<T, object>>? OrderByDescending { get; protected set; }

        protected void AddInclude(
            Expression<Func<T, object>> includeExpression)
        {
            _includes.Add(includeExpression);
        }

        protected void AddInclude(string includeString)
        {
            _includeStrings.Add(includeString);
        }
    }
}