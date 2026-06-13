using Ranki.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Ranki.Data;
using Ranki.DTOs;
using Ranki.Exceptions;
using Ranki.Models;
namespace Ranki.Services.Implementations { public class SubscriptionService : ISubscriptionService { private readonly AppDbContext _context; public SubscriptionService(AppDbContext context) { _context = context; } public async Task SelectPlanAsync(int userId, SubscriptionPlanDto dto) { var validPlans = new[] { "Basic", "Pro", "Business" }; if (!validPlans.Contains(dto.Plan)) throw new BadRequestException("Invalid plan selected."); var existing = await _context.Subscriptions.FirstOrDefaultAsync(s => s.UserId == userId); if (existing != null) { existing.Plan = dto.Plan; existing.Status = "Demo"; existing.StartedAt = DateTime.UtcNow; _context.Subscriptions.Update(existing); } else { var subscription = new Subscription { UserId = userId, Plan = dto.Plan, Status = "Demo" }; _context.Subscriptions.Add(subscription); } await _context.SaveChangesAsync(); } public async Task<object> GetCurrentSubscriptionAsync(int userId) { var sub = await _context.Subscriptions.FirstOrDefaultAsync(s => s.UserId == userId); if (sub == null) throw new NotFoundException("No active subscription found."); return new { sub.Plan, sub.Status, sub.ExpiresAt }; } } }
