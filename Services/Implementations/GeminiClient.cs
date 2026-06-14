using Ranki.Services.Interfaces;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using System.Text.RegularExpressions;

namespace Ranki.Services.Implementations
{
    public interface IGeminiClient { Task<string> GenerateContentAsync(string prompt); }

    public class GeminiClient : IGeminiClient
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;

        public GeminiClient(HttpClient httpClient, IConfiguration config)
        {
            _httpClient = httpClient;
            _apiKey = config["Gemini:ApiKey"] ?? throw new ArgumentNullException("Gemini:ApiKey missing");
        }

        public async Task<string> GenerateContentAsync(string prompt)
        {
            var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={_apiKey}";
            var requestBody = new { contents = new[] { new { parts = new[] { new { text = prompt } } } } };

            int maxRetries = 3;
            for (int i = 0; i < maxRetries; i++)
            {
                var response = await _httpClient.PostAsJsonAsync(url, requestBody);
                var responseJson = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                {
                    if (response.StatusCode == System.Net.HttpStatusCode.TooManyRequests)
                    {
                        // Try to parse "Please retry in X.XXXs"
                        var match = Regex.Match(responseJson, @"retry in ([\d\.]+)s");
                        double delaySeconds = 10; // default fallback
                        if (match.Success && double.TryParse(match.Groups[1].Value, out double parsed))
                        {
                            delaySeconds = parsed + 2; // Add 2 seconds buffer
                        }
                        
                        if (i < maxRetries - 1)
                        {
                            await Task.Delay(TimeSpan.FromSeconds(delaySeconds));
                            continue; // Retry
                        }
                    }
                    throw new Exception($"Gemini API Error: {response.StatusCode} - {responseJson}");
                }

                var doc = JsonDocument.Parse(responseJson);
                var text = doc.RootElement.GetProperty("candidates")[0].GetProperty("content").GetProperty("parts")[0].GetProperty("text").GetString();
                return text ?? string.Empty;
            }

            throw new Exception("Gemini API failed after retries.");
        }
    }
}
