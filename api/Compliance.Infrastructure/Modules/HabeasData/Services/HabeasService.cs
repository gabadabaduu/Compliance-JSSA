using Compliance.Core.Interfaces;

namespace Compliance.Infrastructure.Services;

public class HabeasService : IHabeasService
{
    public Task<string> GetServiceNameAsync() => Task.FromResult("Habeas Data");
}