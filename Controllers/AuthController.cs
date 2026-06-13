using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Ranki.DTOs.Auth;
using Ranki.Services.Interfaces;

namespace Ranki.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var response = await _authService.RegisterAsync(request);
            return Ok(response);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var response = await _authService.LoginAsync(request);
            return Ok(response);
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh([FromBody] RefreshTokenRequest request)
        {
            var response = await _authService.RefreshTokenAsync(request);
            return Ok(response);
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout([FromBody] RefreshTokenRequest request)
        {
            var result = await _authService.LogoutAsync(request);
            if (result)
            {
                return Ok(new { message = "Logged out successfully" });
            }
            return BadRequest(new { message = "Invalid refresh token" });
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            await _authService.ForgotPasswordAsync(request);
            return Ok(new { message = "If the email is registered, a reset link will be sent." });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            var result = await _authService.ResetPasswordAsync(request);
            if (result)
            {
                return Ok(new { message = "Password reset successfully" });
            }
            return BadRequest(new { message = "Invalid request" });
        }
    }
}
