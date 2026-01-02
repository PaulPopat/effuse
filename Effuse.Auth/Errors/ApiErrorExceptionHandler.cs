using System.Text.Json;
using Microsoft.AspNetCore.Diagnostics;

namespace Effuse.Auth.Errors;

public class ApiErrorExceptionHandler : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        if (exception is not IApiError error)
        {
            return false;
        }

        httpContext.Response.StatusCode = error.StatusCode;
        httpContext.Response.Headers.ContentType = "application/json";
        await httpContext.Response.WriteAsJsonAsync(error.Body, cancellationToken: cancellationToken);
        return true;
    }
}