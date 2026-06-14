using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Ranki.DTOs;
using Ranki.Services.Interfaces;
using System.Security.Claims;

namespace Ranki.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "BusinessOwner")]
    public class SubscriptionController : ControllerBase
    {
        private readonly ISubscriptionService _subscriptionService;
        private readonly IIdempotencyService _idempotencyService;

        public SubscriptionController(ISubscriptionService subscriptionService, IIdempotencyService idempotencyService)
        {
            _subscriptionService = subscriptionService;
            _idempotencyService = idempotencyService;
        }

        private int GetUserId()
        {
            return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        }

        [HttpPost("select")]
        public async Task<IActionResult> SelectPlan([FromBody] SubscriptionPlanDto dto, [FromHeader(Name = "Idempotency-Key")] string? idempotencyKey)
        {
            var userId = GetUserId();

            if (!string.IsNullOrWhiteSpace(idempotencyKey))
            {
                bool alreadyProcessed = await _idempotencyService.HasKeyBeenProcessedAsync(idempotencyKey);
                if (alreadyProcessed)
                {
                    return Ok(new { message = "Subscription already processed." });
                }
            }

            await _subscriptionService.SelectPlanAsync(userId, dto);

            if (!string.IsNullOrWhiteSpace(idempotencyKey))
            {
                await _idempotencyService.SaveProcessedKeyAsync(idempotencyKey, userId);
            }

            return Ok(new { message = "Subscription updated successfully." });
        }

        [HttpGet("current")]
        public async Task<IActionResult> GetCurrent()
        {
            var userId = GetUserId();
            var sub = await _subscriptionService.GetCurrentSubscriptionAsync(userId);
            return Ok(sub);
        }
    }
}
