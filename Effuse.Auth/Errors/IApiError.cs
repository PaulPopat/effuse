namespace Effuse.Auth.Errors;

public interface IApiError
{
    int StatusCode { get; }
    object Body { get; }
}