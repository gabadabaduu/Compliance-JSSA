using Compliance.Core.Interfaces;

namespace Compliance.Infrastructure.Services;

public class EpidService : IEpidService
{
    public Task<string> GetServiceNameAsync() => Task.FromResult("EPID");
}