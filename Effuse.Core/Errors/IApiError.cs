namespace Effuse.Core.Errors;

public interface IApiError
{
    int StatusCode { get; }
    object Body { get; }
}