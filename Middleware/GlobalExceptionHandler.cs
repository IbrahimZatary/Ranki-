using Microsoft.AspNetCore.Diagnostics;
using Ranki.Exceptions;

namespace Ranki.Middleware
{
    public class GlobalExceptionHandler : IExceptionHandler
    {
        private readonly ILogger<GlobalExceptionHandler> _logger;

        public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
        {
            _logger = logger;
        }

        public async ValueTask<bool> TryHandleAsync(
            HttpContext httpContext,
            Exception exception,
            CancellationToken cancellationToken)
        {
            _logger.LogError(exception, "Exception occurred: {Message}", exception.Message);

            var (statusCode, message) = exception switch
            {
                NotFoundException => (StatusCodes.Status404NotFound, exception.Message),
                BadRequestException => (StatusCodes.Status400BadRequest, exception.Message),
                UnauthorizedException => (StatusCodes.Status401Unauthorized, exception.Message),
                _ => (StatusCodes.Status500InternalServerError, "An unexpected error occurred.")
            };

            httpContext.Response.StatusCode = statusCode;
            httpContext.Response.ContentType = "application/json";

            await httpContext.Response.WriteAsJsonAsync(new { message }, cancellationToken);

            return true;
        }
    }
}
