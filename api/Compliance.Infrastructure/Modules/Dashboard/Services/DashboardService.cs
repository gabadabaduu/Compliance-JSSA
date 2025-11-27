using Compliance.Core.Interfaces;

namespace Compliance.Infrastructure.Services;

public class DashboardService : IDashboardService
{
    public Task<string> GetServiceNameAsync() => Task.FromResult("Dashboard");
}