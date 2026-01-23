
namespace Effuse.Server.Integrations;

public interface IEnvService
{
  string JwtKey { get; }
  string JwtIssuer { get; }
  string UserInterfaceOrigin { get; }
  string ServerUrl { get; }
  string EffuseUrl { get; }
}

