using Microsoft.EntityFrameworkCore;
using Ranki.Data;
using Ranki.Models;
using Ranki.Services.Interfaces;

namespace Ranki.Services.Implementations
{
    public class IdempotencyService : IIdempotencyService
    {
        private readonly AppDbContext _context;

        public IdempotencyService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<bool> HasKeyBeenProcessedAsync(string key)
        {
            if (string.IsNullOrWhiteSpace(key))
                return false;

            return await _context.IdempotencyRecords.AnyAsync(i => i.Key == key);
        }

        public async Task SaveProcessedKeyAsync(string key, int userId)
        {
            if (string.IsNullOrWhiteSpace(key))
                return;

            var record = new IdempotencyRecord
            {
                Key = key,
                UserId = userId,
                CreatedAt = DateTime.UtcNow
            };

            _context.IdempotencyRecords.Add(record);
            await _context.SaveChangesAsync();
        }
    }
}
