using Compliance.Core.Modules.User.Entities;
using Compliance.Core.Modules.User.Services;
using Compliance.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Compliance.Infrastructure.Auth.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;

        public UserRepository(AppDbContext context) 
        {
            _context = context;
        }

        // ← IMPLEMENTACIONES CORRECTAS SEGÚN TU INTERFAZ

        public async Task<AppUser?> GetByIdAsync(Guid id)
        {
            return await _context.Set<AppUser>()
                .FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<List<AppUser>> GetAllAsync()
        {
            return await _context.Set<AppUser>().ToListAsync();
        }

        public async Task<AppUser?> GetByEmail(string email)
        {
            return await _context.Set<AppUser>()
                .FirstOrDefaultAsync(u => u.Email == email);
        }
    }
}
