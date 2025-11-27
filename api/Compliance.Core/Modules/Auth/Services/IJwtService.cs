using Compliance.Core.Modules.User.Entities;

namespace Compliance.Core.Modules.Auth.Services
{
    public interface IJwtService
    {
        string GenerateToken(AppUser user);
    }
}
