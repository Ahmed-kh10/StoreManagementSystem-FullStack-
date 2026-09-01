using Store.Application.Interfaces;
using Store.Domain.Entities;
using Store.Infrastructure.Data;

namespace Store.Infrastructure.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly StoreDbContext _context;
        private readonly Dictionary<Type, object> _repositories = new();

        public UnitOfWork(StoreDbContext context)
        {
            _context = context;
        }

        public IGenericRepository<T> Repository<T>() where T : BaseEntity
        {
            if(_repositories.TryGetValue(typeof(T), out var repository))
            {
                return (IGenericRepository<T>)repository;
            }
            var newRepository = new GenericRepository<T>(_context);
            _repositories.Add(typeof(T), newRepository);
            return newRepository;
        }

        public async Task SaveChangesAsync(CancellationToken ct = default)
        {
            await _context.SaveChangesAsync(ct);
        }
    }
}
