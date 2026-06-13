using System.Collections.Generic;
using System.Threading.Tasks;

namespace Ranki.Services.Interfaces
{
    public interface INotificationService
    {
        Task<object> GetUserNotificationsAsync(int userId);
        Task<bool> MarkAsReadAsync(int notificationId, int userId);
    }
}
