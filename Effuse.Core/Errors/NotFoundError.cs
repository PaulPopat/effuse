namespace Effuse.Core.Errors;

public class NotFoundError(string area, string resource) : Exception, IApiError
{
    public int StatusCode => 403;

    public object Body => new
    {
        Error = "NotFound",
        Area = area,
        Resource = resource,
    };
}