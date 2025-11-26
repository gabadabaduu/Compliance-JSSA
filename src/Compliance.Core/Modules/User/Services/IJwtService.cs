using Compliance.Core.Modules.User.Entities;

namespace Compliance.Core.Modules.User.Services
{
    public interface IJwtService
    {
        string GenerateToken(AppUser user);
    }
}
