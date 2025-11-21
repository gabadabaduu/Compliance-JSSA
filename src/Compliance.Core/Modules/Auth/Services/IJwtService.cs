using Compliance.Core.Modules.Auth.Entities;

namespace Compliance.Core.Modules.Auth.Services
{
    public interface IJwtService
    {
        string GenerateToken(User user);
    }
}
