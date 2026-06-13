using System.Threading.Tasks;

namespace Ranki.Services.Interfaces
{
    public interface ISettingsService
    {
        Task<bool> UpdatePasswordAsync(int userId, string currentPassword, string newPassword);
        Task<bool> DeleteAccountAsync(int userId);
    }
}
