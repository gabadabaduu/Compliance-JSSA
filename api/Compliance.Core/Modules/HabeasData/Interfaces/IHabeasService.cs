namespace Compliance.Core.Interfaces;

public interface IHabeasService
{
    Task<string> GetServiceNameAsync();
}