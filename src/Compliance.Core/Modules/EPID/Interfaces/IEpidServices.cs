namespace Compliance.Core.Interfaces;

public interface IEpidService
{
    Task<string> GetServiceNameAsync();
}