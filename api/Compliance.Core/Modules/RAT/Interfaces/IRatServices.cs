namespace Compliance.Core.Interfaces;

public interface IRatService
{
    Task<string> GetServiceNameAsync();
}