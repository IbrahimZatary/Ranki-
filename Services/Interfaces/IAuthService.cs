using System.Threading.Tasks;
using Ranki.DTOs.Auth;
using Ranki.Models;

namespace Ranki.Services.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponse> RegisterAsync(RegisterRequest request);
        Task<AuthResponse> LoginAsync(LoginRequest request);
        Task<AuthResponse> RefreshTokenAsync(RefreshTokenRequest request);
        Task<bool> LogoutAsync(RefreshTokenRequest request);
        Task<bool> ForgotPasswordAsync(ForgotPasswordRequest request);
        Task<bool> ResetPasswordAsync(ResetPasswordRequest request);
    }
}
