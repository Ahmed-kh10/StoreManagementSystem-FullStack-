using Store.Application.Specifications;
using Store.Domain.Entities;

namespace Store.Application.Interfaces
{
    public interface IGenericRepository<T> where T : BaseEntity
    {
        Task<IEnumerable<T>> GetAllAsync(CancellationToken ct = default);
        Task<T?> GetByIdAsync(int id , CancellationToken ct = default);
        Task DeleteAsync(int id , CancellationToken ct = default);
        Task AddAsync(T entity , CancellationToken ct = default);
        Task UpdateAsync(T entity , CancellationToken ct = default);
        Task<IReadOnlyList<T>> ListAsync(ISpecification<T> spec, CancellationToken ct = default);
        Task<int> CountAsync(ISpecification<T> spec, CancellationToken ct = default);
    }
}
