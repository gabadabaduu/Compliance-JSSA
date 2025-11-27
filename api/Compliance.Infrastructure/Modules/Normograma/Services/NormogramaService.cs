using Compliance.Core.Interfaces;

namespace Compliance.Infrastructure.Services;

public class NormogramaService : INormogramaService
{
    public Task<string> GetServiceNameAsync() => Task.FromResult("Normograma");
}