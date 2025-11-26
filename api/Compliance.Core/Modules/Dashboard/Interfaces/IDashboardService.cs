namespace Compliance.Core.Interfaces;

public interface IDashboardService
{
    Task<string> GetServiceNameAsync();
}