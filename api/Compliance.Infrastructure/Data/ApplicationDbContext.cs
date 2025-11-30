using Microsoft.EntityFrameworkCore;
using Compliance.Core.Modules.User.Entities;
using Compliance.Infrastructure.Entities;

namespace Compliance.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<AppUser> Users { get; set; }

    public DbSet<EpidEntity> Epids { get; set; }
    public DbSet<HabeasDataEntity> HabeasDatas { get; set; } = null!;
    public DbSet<RatEntity> Rats { get; set; } = null!;
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configurar Users
        modelBuilder.Entity<AppUser>(entity =>
        {
            entity.ToTable("users");
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Email).HasColumnName("email").IsRequired();
            entity.Property(e => e.FullName).HasColumnName("full_name");
            entity.Property(e => e.Role).HasColumnName("role").IsRequired().HasMaxLength(50);
            entity.Property(e => e.OrganizationId).HasColumnName("organization_id");
            entity.Property(e => e.AvatarUrl).HasColumnName("avatar_url");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");

            entity.HasIndex(e => e.Email).IsUnique();
        });

        modelBuilder.Entity<EpidEntity>(eb =>
        {
            eb.ToTable("Epid");
            eb.HasKey(e => e.Id);
            eb.Property(e => e.Id).HasColumnName("id");
            eb.Property(e => e.Name).HasColumnName("name").IsRequired();
        });

        modelBuilder.Entity<HabeasDataEntity>(eb =>
        {
            eb.ToTable("Habeas_Data"); // ajustar al nombre real de la tabla, por ejemplo "habeas_data"
            eb.HasKey(e => e.Id);
            eb.Property(e => e.Id).HasColumnName("id");
            eb.Property(e => e.Name).HasColumnName("name");
        });

        modelBuilder.Entity<RatEntity>(eb =>
        {
            eb.ToTable("Rat");
            eb.HasKey(e => e.Id);
            eb.Property(e => e.Id).HasColumnName("id");
            eb.Property(e => e.Name).HasColumnName("name").IsRequired();
        });
        // ... otras configuraciones
    }
}