namespace Effuse.Core.Errors;

public class ConflictError(string area, string on) : Exception, IApiError
{
    public int StatusCode => 409;

    public object Body => new
    {
        Error = "Conflict",
        Area = area,
        On = on,
    };
}