namespace Compliance.Core.Interfaces;

public interface IAuthService
{
    Task<string> GetServiceNameAsync();
}