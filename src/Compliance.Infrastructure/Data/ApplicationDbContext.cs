using Microsoft.EntityFrameworkCore;
using Compliance.Core.Modules.Auth.Entities;

namespace Compliance.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }

    // Tus tablas aquí
    public DbSet<User> Users { get; set; }
}
