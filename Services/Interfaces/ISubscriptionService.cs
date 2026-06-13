using Ranki.DTOs;

namespace Ranki.Services.Interfaces
{
    public interface ISubscriptionService
    {
        Task SelectPlanAsync(int userId, SubscriptionPlanDto dto);
        Task<object> GetCurrentSubscriptionAsync(int userId);
    }
}
