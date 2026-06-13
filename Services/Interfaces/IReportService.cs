using System.Threading.Tasks;

namespace Ranki.Services.Interfaces
{
    public interface IReportService
    {
        Task<byte[]> GenerateReportAsync(int userId, int sessionId);
    }
}
