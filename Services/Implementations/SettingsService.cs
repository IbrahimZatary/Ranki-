using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Ranki.Data;
using Ranki.Exceptions;
using Ranki.Services.Interfaces;
using BCrypt.Net;

namespace Ranki.Services.Implementations
{
    public class SettingsService : ISettingsService
    {
        private readonly AppDbContext _context;

        public SettingsService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<bool> UpdatePasswordAsync(int userId, string currentPassword, string newPassword)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) throw new NotFoundException("User not found");

            if (!BCrypt.Net.BCrypt.Verify(currentPassword, user.PasswordHash))
            {
                throw new BadRequestException("Invalid current password");
            }

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAccountAsync(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return false;

            // Cascade delete will handle related entities if configured, 
            // otherwise we'd need to delete them manually.
            // For simplicity, we just remove the user here assuming EF cascade is on or we handle it.
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
