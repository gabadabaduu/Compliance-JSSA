using Compliance.Core.Modules.User.Entities;

namespace Compliance.Core.Modules.User.Services
{
    public interface IUserRepository
    {
        Task<AppUser?> GetByIdAsync(Guid id);
        Task<List<AppUser>> GetAllAsync();
        Task<AppUser?> GetByEmail(string email);
    }
}
