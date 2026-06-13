using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Ranki.Services.Interfaces;
using System.Security.Claims;

namespace Ranki.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "BusinessOwner")]
    public class ScanController : ControllerBase
    {
        private readonly IScanService _scanService;

        public ScanController(IScanService scanService)
        {
            _scanService = scanService;
        }

        private int GetUserId()
        {
            return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        }

        [HttpPost("start")]
        public async Task<IActionResult> StartScan()
        {
            var userId = GetUserId();
            var sessionId = await _scanService.StartScanAsync(userId);
            return Ok(new { ScanSessionId = sessionId });
        }

        [HttpGet("status/{sessionId}")]
        public async Task<IActionResult> GetStatus(int sessionId)
        {
            var userId = GetUserId();
            var status = await _scanService.GetStatusAsync(userId, sessionId);
            return Ok(status);
        }

        [HttpGet("results/{sessionId}")]
        public async Task<IActionResult> GetResults(int sessionId)
        {
            var userId = GetUserId();
            var results = await _scanService.GetResultsAsync(userId, sessionId);
            return Ok(results);
        }
    }
}
