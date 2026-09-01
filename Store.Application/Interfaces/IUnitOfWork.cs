using Store.Domain.Entities;

namespace Store.Application.Interfaces
{
    public interface IUnitOfWork
    {
        IGenericRepository<T> Repository<T>() where T : BaseEntity;
        Task SaveChangesAsync(CancellationToken ct = default);
    }
}
