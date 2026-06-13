using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Ranki.Data;
using Ranki.Services.Interfaces;

namespace Ranki.Services.Implementations
{
    public class DashboardService : IDashboardService
    {
        private readonly AppDbContext _context;

        public DashboardService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<object> GetDashboardSummaryAsync(int userId)
        {
            var profile = await _context.BusinessProfiles.FirstOrDefaultAsync(b => b.UserId == userId);
            var latestScan = await _context.ScanSessions
                .Where(s => s.UserId == userId && s.Status == "Completed")
                .OrderByDescending(s => s.CompletedAt)
                .FirstOrDefaultAsync();

            var pendingRecs = await _context.Recommendations
                .Where(r => r.UserId == userId && !r.IsImplemented)
                .CountAsync();

            var competitorsCount = await _context.Competitors
                .Where(c => c.UserId == userId)
                .CountAsync();

            return new
            {
                HasProfile = profile != null,
                LatestVisibilityScore = latestScan?.VisibilityScore ?? 0,
                LastScanDate = latestScan?.CompletedAt,
                PendingRecommendations = pendingRecs,
                CompetitorsDiscovered = competitorsCount
            };
        }

        public async Task<object> GetRecentScansAsync(int userId)
        {
            var scans = await _context.ScanSessions
                .Where(s => s.UserId == userId)
                .OrderByDescending(s => s.StartedAt)
                .Take(5)
                .Select(s => new
                {
                    s.Id,
                    s.Status,
                    s.VisibilityScore,
                    s.StartedAt,
                    s.CompletedAt,
                    s.Progress,
                    s.CurrentStep
                })
                .ToListAsync();

            return scans;
        }
    }
}
