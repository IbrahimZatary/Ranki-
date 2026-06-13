using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Ranki.Services.Interfaces;

namespace Ranki.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ReportsController : ControllerBase
    {
        private readonly IReportService _reportService;

        public ReportsController(IReportService reportService)
        {
            _reportService = reportService;
        }

        private int GetUserId()
        {
            return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        }

        [HttpGet("{sessionId}/download")]
        public async Task<IActionResult> DownloadReport(int sessionId)
        {
            try
            {
                var userId = GetUserId();
                var fileBytes = await _reportService.GenerateReportAsync(userId, sessionId);
                
                // We return as text/plain since we mocked the PDF generation with a text string.
                // In a real implementation, use "application/pdf".
                return File(fileBytes, "text/plain", $"Ranki_Report_{sessionId}.txt");
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
