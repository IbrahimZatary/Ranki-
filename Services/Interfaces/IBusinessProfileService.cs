using Ranki.DTOs;
using Ranki.Models;

namespace Ranki.Services.Interfaces
{
    public interface IBusinessProfileService
    {
        Task<BusinessProfile> CreateProfileAsync(int userId, BusinessProfileDto dto);
        Task<BusinessProfile> GetProfileAsync(int userId);
        Task<BusinessProfile> UpdateProfileAsync(int userId, BusinessProfileDto dto);
    }
}
