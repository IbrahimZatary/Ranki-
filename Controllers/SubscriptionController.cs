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

        public SubscriptionController(ISubscriptionService subscriptionService)
        {
            _subscriptionService = subscriptionService;
        }

        private int GetUserId()
        {
            return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        }

        [HttpPost("select")]
        public async Task<IActionResult> SelectPlan([FromBody] SubscriptionPlanDto dto)
        {
            var userId = GetUserId();
            await _subscriptionService.SelectPlanAsync(userId, dto);
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
