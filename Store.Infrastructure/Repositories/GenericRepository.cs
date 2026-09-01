using Microsoft.EntityFrameworkCore;
using Store.Application.Interfaces;
using Store.Application.Specifications;
using Store.Domain.Entities;
using Store.Infrastructure.Data;

namespace Store.Infrastructure.Repositories
{
    public class GenericRepository<T> : IGenericRepository<T>
        where T : BaseEntity
    {
        private readonly StoreDbContext _context;
        private readonly DbSet<T> _dbSet;

        public GenericRepository(StoreDbContext context)
        {
            _context = context;
            _dbSet = context.Set<T>();
        }

        public async Task<IEnumerable<T>> GetAllAsync(
            CancellationToken ct = default)
        {
            return await _dbSet.ToListAsync(ct);
        }

        public async Task<T?> GetByIdAsync(
            int id,
            CancellationToken ct = default)
        {
            return await _dbSet.FirstOrDefaultAsync(
                x => x.Id == id,
                ct);
        }

        public async Task AddAsync(
            T entity,
            CancellationToken ct = default)
        {
            await _dbSet.AddAsync(entity, ct);
        }

        public async Task DeleteAsync(
            int id,
            CancellationToken ct = default)
        {
            var entity = await _dbSet.FirstOrDefaultAsync(
                x => x.Id == id,
                ct);

            if (entity != null)
            {
                _dbSet.Remove(entity);
            }
        }

        public Task UpdateAsync(
            T entity,
            CancellationToken ct = default)
        {
            _dbSet.Update(entity);

            return Task.CompletedTask;
        }

        public async Task<IReadOnlyList<T>> ListAsync(
            ISpecification<T> spec,
            CancellationToken ct = default)
        {
            IQueryable<T> query = _dbSet.AsQueryable();

            if (spec.Criteria != null)
            {
                query = query.Where(spec.Criteria);
            }

            foreach (var include in spec.Includes)
            {
                query = query.Include(include);
            }

            foreach (var includeString in spec.IncludeStrings)
            {
                query = query.Include(includeString);
            }

            if (spec.OrderBy != null)
            {
                query = query.OrderBy(spec.OrderBy);
            }
            else if (spec.OrderByDescending != null)
            {
                query = query.OrderByDescending(
                    spec.OrderByDescending);
            }

            if (spec.Skip.HasValue)
            {
                query = query.Skip(spec.Skip.Value);
            }

            if (spec.Take.HasValue)
            {
                query = query.Take(spec.Take.Value);
            }

            return await query.ToListAsync(ct);
        }

        public async Task<int> CountAsync(
            ISpecification<T> spec,
            CancellationToken ct = default)
        {
            IQueryable<T> query = _dbSet.AsQueryable();

            if (spec.Criteria != null)
            {
                query = query.Where(spec.Criteria);
            }

            return await query.CountAsync(ct);
        }
    }
}