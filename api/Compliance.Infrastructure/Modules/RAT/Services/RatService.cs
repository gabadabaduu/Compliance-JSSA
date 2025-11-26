using Compliance.Core.Interfaces;

namespace Compliance.Infrastructure.Services;

public class RatService : IRatService
{
    public Task<string> GetServiceNameAsync() => Task.FromResult("RAT");
}