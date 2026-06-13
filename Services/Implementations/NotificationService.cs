using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Ranki.Data;
using Ranki.Services.Interfaces;

namespace Ranki.Services.Implementations
{
    public class NotificationService : INotificationService
    {
        private readonly AppDbContext _context;

        public NotificationService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<object> GetUserNotificationsAsync(int userId)
        {
            return await _context.Notifications
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.CreatedAt)
                .Select(n => new
                {
                    n.Id,
                    n.Message,
                    n.IsRead,
                    n.CreatedAt
                })
                .ToListAsync();
        }

        public async Task<bool> MarkAsReadAsync(int notificationId, int userId)
        {
            var notification = await _context.Notifications
                .FirstOrDefaultAsync(n => n.Id == notificationId && n.UserId == userId);
            
            if (notification == null) return false;

            notification.IsRead = true;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
