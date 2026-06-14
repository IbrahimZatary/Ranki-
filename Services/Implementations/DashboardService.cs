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
                .Where(r => r.UserId == userId && !r.IsCompleted)
                .CountAsync();

            var competitorsCount = await _context.Competitors
                .Where(c => c.UserId == userId)
                .CountAsync();

            var competitors = await _context.Competitors
                .Where(c => c.UserId == userId)
                .OrderByDescending(c => c.CreatedAt)
                .Take(5)
                .Select(c => new { c.Name, c.WebsiteUrl })
                .ToListAsync();

            var recommendations = await _context.Recommendations
                .Where(r => r.UserId == userId)
                .OrderByDescending(r => r.CreatedAt)
                .Take(5)
                .Select(r => new { r.RecommendationText, r.Category, r.Priority, r.IsCompleted })
                .ToListAsync();

            var generatedFiles = await _context.GeneratedFiles
                .Where(g => g.UserId == userId)
                .OrderByDescending(g => g.CreatedAt)
                .Take(2)
                .Select(g => new { g.FileType, g.Content })
                .ToListAsync();

            return new
            {
                HasProfile = profile != null,
                LatestVisibilityScore = latestScan?.VisibilityScore ?? 0,
                LastScanDate = latestScan?.CompletedAt,
                PendingRecommendations = pendingRecs,
                CompetitorsDiscovered = competitorsCount,
                Competitors = competitors,
                Recommendations = recommendations,
                GeneratedFiles = generatedFiles
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
