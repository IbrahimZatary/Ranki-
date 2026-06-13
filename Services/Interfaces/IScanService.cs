namespace Ranki.Services.Interfaces
{
    public interface IScanService
    {
        Task<int> StartScanAsync(int userId);
        Task<object> GetStatusAsync(int userId, int sessionId);
        Task<object> GetResultsAsync(int userId, int sessionId);
        Task ProcessScanSessionAsync(int sessionId);
    }
}
