using System.Text.Json;
using Hangfire;
using Microsoft.EntityFrameworkCore;
using Ranki.Data;
using Ranki.Exceptions;
using Ranki.Models;
using Ranki.Services.Interfaces;

namespace Ranki.Services.Implementations
{
    public class ScanService : IScanService
    {
        private readonly AppDbContext _context;
        private readonly IGeminiClient _gemini;

        public ScanService(AppDbContext context, IGeminiClient gemini)
        {
            _context = context;
            _gemini = gemini;
        }

        public async Task<int> StartScanAsync(int userId)
        {
            var profile = await _context.BusinessProfiles.FirstOrDefaultAsync(b => b.UserId == userId);
            if (profile == null)
                throw new BadRequestException("Please complete your business profile first.");

            var session = new ScanSession
            {
                UserId = userId,
                Status = "Pending",
                StartedAt = DateTime.UtcNow
            };

            _context.ScanSessions.Add(session);

            var activityLog = new ActivityLog
            {
                UserId = userId,
                Action = "Scan Started",
                CreatedAt = DateTime.UtcNow
            };
            _context.ActivityLogs.Add(activityLog);

            await _context.SaveChangesAsync();

            BackgroundJob.Enqueue<IScanService>(x => x.ProcessScanSessionAsync(session.Id));

            return session.Id;
        }

        public async Task<object> GetStatusAsync(int userId, int sessionId)
        {
            var session = await _context.ScanSessions.FirstOrDefaultAsync(s => s.Id == sessionId && s.UserId == userId);
            if (session == null)
                throw new NotFoundException("Scan session not found.");

            return new
            {
                session.Status,
                session.Progress,
                session.CurrentStep
            };
        }

        public async Task<object> GetResultsAsync(int userId, int sessionId)
        {
            var session = await _context.ScanSessions.FirstOrDefaultAsync(s => s.Id == sessionId && s.UserId == userId);
            if (session == null)
                throw new NotFoundException("Scan session not found.");

            var competitors = await _context.Competitors.Where(c => c.UserId == userId).OrderBy(c => c.Rank).ToListAsync();
            var recommendations = await _context.Recommendations.Where(r => r.UserId == userId).OrderBy(r => r.Priority).ToListAsync();
            var files = await _context.GeneratedFiles.Where(f => f.UserId == userId).ToListAsync();

            return new
            {
                session.VisibilityScore,
                Competitors = competitors,
                Recommendations = recommendations,
                GeneratedFiles = files
            };
        }

        public async Task ProcessScanSessionAsync(int sessionId)
        {
            var session = await _context.ScanSessions.FindAsync(sessionId);
            if (session == null) return;

            var profile = await _context.BusinessProfiles.FirstOrDefaultAsync(b => b.UserId == session.UserId);
            if (profile == null)
            {
                session.Status = "Failed";
                session.ErrorMessage = "Business profile missing.";
                await _context.SaveChangesAsync();
                return;
            }

            try
            {
                session.Status = "Processing";
                await _context.SaveChangesAsync();

                // STEP A: Generate Questions
                session.CurrentStep = "Generating questions";
                session.Progress = 10;
                await _context.SaveChangesAsync();

                var promptA = $"You are a customer research expert. Generate 50 high-intent questions that real customers ask when searching for {profile.Industry} services in {profile.Country}. Categories: best/fastest/cheapest/most reliable, comparison questions (X vs Y), problem-specific, recommendation questions. Return strictly a JSON array of strings.";
                var responseA = await _gemini.GenerateContentAsync(promptA);
                
                var jsonStrA = responseA.Replace("```json", "").Replace("```", "").Trim();
                var questionsList = JsonSerializer.Deserialize<List<string>>(jsonStrA) ?? new List<string>();

                var newQuestions = questionsList.Select(q => new Question
                {
                    UserId = session.UserId,
                    QuestionText = q.Length > 500 ? q.Substring(0, 500) : q,
                    Category = "auto-generated",
                    CreatedAt = DateTime.UtcNow
                }).ToList();

                _context.Questions.AddRange(newQuestions);
                await _context.SaveChangesAsync();
                
                // STEP B: Discover Competitors
                session.CurrentStep = "Competitors discovered";
                session.Progress = 20;
                await _context.SaveChangesAsync();

                var promptB = $"List the top 10 {profile.Industry} companies in {profile.Country} that would appear in AI search results. For each: name, websiteUrl. Return strictly a JSON array of objects with properties 'name' and 'websiteUrl'.";
                var responseB = await _gemini.GenerateContentAsync(promptB);

                var jsonStrB = responseB.Replace("```json", "").Replace("```", "").Trim();
                var competitorsList = JsonSerializer.Deserialize<List<CompetitorDto>>(jsonStrB, new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? new List<CompetitorDto>();

                var newCompetitors = competitorsList.Select(c => new Competitor
                {
                    UserId = session.UserId,
                    Name = c.Name.Length > 255 ? c.Name.Substring(0, 255) : c.Name,
                    WebsiteUrl = c.WebsiteUrl?.Length > 500 ? c.WebsiteUrl.Substring(0, 500) : c.WebsiteUrl,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                }).ToList();

                // Clear old competitors if needed or just add new? The prompt doesn't specify, we'll just add new ones for now.
                _context.Competitors.AddRange(newCompetitors);
                await _context.SaveChangesAsync();

            }
            catch(Exception ex)
            {
                session.Status = "Failed";
                session.ErrorMessage = ex.Message;
                await _context.SaveChangesAsync();
            }
        }

        private class CompetitorDto
        {
            public string Name { get; set; } = string.Empty;
            public string? WebsiteUrl { get; set; }
        }
    }
}
