using Compliance.Core.Modules.Auth.Entities;

namespace Compliance.Core.Modules.Auth.Services
{
    public interface IUserRepository
    {
        Task<User?> GetByIdAsync(Guid id);
        Task<List<User>> GetAllAsync();
        Task<User?> GetByEmail(string email);
    }
}
