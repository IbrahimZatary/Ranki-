using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Ranki.Data;
using Ranki.Services.Interfaces;

namespace Ranki.Services.Implementations
{
    public class AdminService : IAdminService
    {
        private readonly AppDbContext _context;

        public AdminService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<object> GetAllUsersAsync()
        {
            return await _context.Users
                .Select(u => new
                {
                    u.Id,
                    u.Email,
                    u.FullName,
                    u.Role,
                    u.CreatedAt
                })
                .ToListAsync();
        }

        public async Task<object> GetAllScansAsync()
        {
            return await _context.ScanSessions
                .Include(s => s.User)
                .OrderByDescending(s => s.StartedAt)
                .Select(s => new
                {
                    s.Id,
                    UserEmail = s.User != null ? s.User.Email : "Unknown",
                    s.Status,
                    s.VisibilityScore,
                    s.StartedAt,
                    s.CompletedAt
                })
                .ToListAsync();
        }

        public async Task<bool> UpdateUserRoleAsync(int userId, string newRole)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return false;

            user.Role = newRole;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
