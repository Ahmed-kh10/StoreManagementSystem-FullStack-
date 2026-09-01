using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace Store.API.Middleware
{
    public class ExceptionMiddleware : IExceptionHandler
    {
        private readonly ILogger<ExceptionMiddleware> _logger;

        public ExceptionMiddleware(
            ILogger<ExceptionMiddleware> logger)
        {
            _logger = logger;
        }

        public async ValueTask<bool> TryHandleAsync(
            HttpContext httpContext,
            Exception exception,
            CancellationToken cancellationToken)
        {
            _logger.LogError(
                exception,
                "Unhandled exception: {Message}",
                exception.Message);

            var statusCode = exception switch
            {
                KeyNotFoundException =>
                    StatusCodes.Status404NotFound,

                ArgumentException =>
                    StatusCodes.Status400BadRequest,

                InvalidOperationException =>
                    StatusCodes.Status400BadRequest,

                UnauthorizedAccessException =>
                    StatusCodes.Status401Unauthorized,

                _ =>
                    StatusCodes.Status500InternalServerError
            };

            var problem = new ProblemDetails
            {
                Status = statusCode,

                Title = statusCode switch
                {
                    400 => "Bad Request",
                    401 => "Unauthorized",
                    404 => "Resource Not Found",
                    _ => "Internal Server Error"
                },

                Detail = statusCode == 500
                    ? "An unexpected error occurred."
                    : exception.Message,

                Instance = httpContext.Request.Path
            };

            problem.Extensions["traceId"] =
                httpContext.TraceIdentifier;

            httpContext.Response.StatusCode =
                statusCode;

            await httpContext.Response.WriteAsJsonAsync(
                problem,
                cancellationToken);

            return true;
        }
    }
}