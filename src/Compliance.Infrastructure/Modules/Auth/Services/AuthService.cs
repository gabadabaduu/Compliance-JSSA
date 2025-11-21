using Compliance.Core.Interfaces;

namespace Compliance.Infrastructure.Services;

public class AuthService : IAuthService
{
    public Task<string> GetServiceNameAsync() => Task.FromResult("Auth");
}