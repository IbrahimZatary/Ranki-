using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Ranki.Data;
using Ranki.Exceptions;
using Ranki.Services.Interfaces;

namespace Ranki.Services.Implementations
{
    public class ReportService : IReportService
    {
        private readonly AppDbContext _context;

        public ReportService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<byte[]> GenerateReportAsync(int userId, int sessionId)
        {
            var session = await _context.ScanSessions.FirstOrDefaultAsync(s => s.Id == sessionId && s.UserId == userId);
            if (session == null)
            {
                throw new NotFoundException("Scan session not found");
            }

            var profile = await _context.BusinessProfiles.FirstOrDefaultAsync(b => b.UserId == userId);
            var competitors = await _context.Competitors.Where(c => c.UserId == userId).ToListAsync();
            var recommendations = await _context.Recommendations.Where(r => r.UserId == userId).ToListAsync();

            var sb = new StringBuilder();
            sb.AppendLine($"RANKI VISIBILITY REPORT");
            sb.AppendLine($"======================");
            sb.AppendLine($"Business Name: {profile?.CompanyName}");
            sb.AppendLine($"Industry: {profile?.Industry}");
            sb.AppendLine($"Visibility Score: {session.VisibilityScore}/100");
            sb.AppendLine();
            sb.AppendLine("Top Competitors:");
            foreach (var c in competitors)
            {
                sb.AppendLine($"- {c.Name} ({c.WebsiteUrl})");
            }
            sb.AppendLine();
            sb.AppendLine("Recommendations:");
            foreach (var r in recommendations)
            {
                sb.AppendLine($"- [{r.Priority}] {r.Title}: {r.Description}");
            }

            // In a real application, you would use a library like iText7 or QuestPDF to convert this string/HTML to a real PDF.
            // For now, we return the string as bytes.
            return Encoding.UTF8.GetBytes(sb.ToString());
        }
    }
}
