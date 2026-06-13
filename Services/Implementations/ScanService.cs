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

                // STEP C: Citation Scanning (Mocked via Gemini for Stage 6)
                session.CurrentStep = "Scanning citations";
                session.Progress = 50;
                await _context.SaveChangesAsync();

                var promptC = $"Given the business {profile.BusinessName} in {profile.Industry}, generate 5 fake search results (citations) showing how they might appear on Google or AI summaries. For each, return: Source (string), Snippet (string), IsPositive (boolean). Return strictly a JSON array of objects.";
                var responseC = await _gemini.GenerateContentAsync(promptC);
                var jsonStrC = responseC.Replace("```json", "").Replace("```", "").Trim();
                var citationsList = JsonSerializer.Deserialize<List<CitationDto>>(jsonStrC, new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? new List<CitationDto>();

                // Convert to ScanResult and save
                var scanResults = citationsList.Select(c => new ScanResult
                {
                    UserId = session.UserId,
                    QuestionId = newQuestions.FirstOrDefault()?.Id ?? 0, // Mock association
                    UserWasCited = c.IsPositive,
                    ResponseSnippet = c.Snippet?.Length > 500 ? c.Snippet.Substring(0, 500) : c.Snippet,
                    GeminiResponse = c.Source,
                    ScanDate = DateTime.UtcNow
                }).ToList();
                _context.ScanResults.AddRange(scanResults);
                await _context.SaveChangesAsync();

                // STEP D: Visibility scoring, recommendations (Stage 7)
                session.CurrentStep = "Generating recommendations";
                session.Progress = 75;
                await _context.SaveChangesAsync();

                session.VisibilityScore = citationsList.Count(c => c.IsPositive) * 20;

                var promptD = $"Based on a visibility score of {session.VisibilityScore} out of 100 for {profile.BusinessName}, generate 3 actionable recommendations to improve AI search visibility. For each: Title (string), Description (string), Priority (High/Medium/Low). Return strictly a JSON array of objects.";
                var responseD = await _gemini.GenerateContentAsync(promptD);
                var jsonStrD = responseD.Replace("```json", "").Replace("```", "").Trim();
                var recsList = JsonSerializer.Deserialize<List<RecommendationDto>>(jsonStrD, new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? new List<RecommendationDto>();

                var recommendations = recsList.Select(r => new Recommendation
                {
                    UserId = session.UserId,
                    RecommendationText = r.Title?.Length > 1000 ? r.Title.Substring(0, 1000) : (r.Title ?? "Recommendation"),
                    Category = r.Description?.Length > 100 ? r.Description.Substring(0, 100) : r.Description,
                    Priority = 1,
                    IsCompleted = false,
                    CreatedAt = DateTime.UtcNow
                }).ToList();
                _context.Recommendations.AddRange(recommendations);
                await _context.SaveChangesAsync();

                // STEP E: robots.txt and llms.txt generator (Stage 8)
                session.CurrentStep = "Generating files";
                session.Progress = 90;
                await _context.SaveChangesAsync();

                var robotsTxt = "User-agent: *\nAllow: /\nSitemap: https://yourdomain.com/sitemap.xml";
                var llmsTxt = $"# LLM Optimization File for {profile.BusinessName}\nCompany: {profile.BusinessName}\nIndustry: {profile.Industry}\nCountry: {profile.Country}";

                _context.GeneratedFiles.AddRange(
                    new GeneratedFile { UserId = session.UserId, FileType = "robots.txt", Content = robotsTxt, CreatedAt = DateTime.UtcNow },
                    new GeneratedFile { UserId = session.UserId, FileType = "llms.txt", Content = llmsTxt, CreatedAt = DateTime.UtcNow }
                );

                session.Status = "Completed";
                session.CurrentStep = "Scan complete";
                session.Progress = 100;
                session.CompletedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

            }
            catch (Exception ex)
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

        private class CitationDto
        {
            public string? Source { get; set; }
            public string? Snippet { get; set; }
            public bool IsPositive { get; set; }
        }

        private class RecommendationDto
        {
            public string? Title { get; set; }
            public string? Description { get; set; }
            public string? Priority { get; set; }
        }
    }
}
