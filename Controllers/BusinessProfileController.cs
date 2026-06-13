using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Ranki.DTOs;
using Ranki.Services.Interfaces;
using System.Security.Claims;

namespace Ranki.Controllers
{
    [Route("api/business-profile")]
    [ApiController]
    [Authorize(Roles = "BusinessOwner")]
    public class BusinessProfileController : ControllerBase
    {
        private readonly IBusinessProfileService _businessProfileService;

        public BusinessProfileController(IBusinessProfileService businessProfileService)
        {
            _businessProfileService = businessProfileService;
        }

        private int GetUserId()
        {
            return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        }

        [HttpPost]
        public async Task<IActionResult> CreateProfile([FromBody] BusinessProfileDto dto)
        {
            var userId = GetUserId();
            var profile = await _businessProfileService.CreateProfileAsync(userId, dto);
            return Ok(profile);
        }

        [HttpGet]
        public async Task<IActionResult> GetProfile()
        {
            var userId = GetUserId();
            var profile = await _businessProfileService.GetProfileAsync(userId);
            return Ok(profile);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateProfile([FromBody] BusinessProfileDto dto)
        {
            var userId = GetUserId();
            var profile = await _businessProfileService.UpdateProfileAsync(userId, dto);
            return Ok(profile);
        }
    }
}
