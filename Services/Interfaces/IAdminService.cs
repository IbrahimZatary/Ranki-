using System.Collections.Generic;
using System.Threading.Tasks;

namespace Ranki.Services.Interfaces
{
    public interface IAdminService
    {
        Task<object> GetAllUsersAsync();
        Task<object> GetAllScansAsync();
        Task<bool> UpdateUserRoleAsync(int userId, string newRole);
    }
}
