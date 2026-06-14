namespace Ranki.Services.Interfaces
{
    public interface IIdempotencyService
    {
        Task<bool> HasKeyBeenProcessedAsync(string key);
        Task SaveProcessedKeyAsync(string key, int userId);
    }
}
