namespace Effuse.Core.Errors;

public class UnauthorisedError(string area, string reason) : Exception, IApiError
{
    public int StatusCode => 403;

    public object Body => new
    {
        Error = "Unauthorised",
        Area = area,
        Reason = reason,
    };
}