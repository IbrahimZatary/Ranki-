using System.Collections.Generic;
using System.Threading.Tasks;

namespace Ranki.Services.Interfaces
{
    public interface IDashboardService
    {
        Task<object> GetDashboardSummaryAsync(int userId);
        Task<object> GetRecentScansAsync(int userId);
    }
}
