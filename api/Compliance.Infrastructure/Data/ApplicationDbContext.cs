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
    public DbSet<NormativaEntity> Normativas { get; set; } = null!;
    public DbSet<SancionEntity> Sanciones { get; set; } = null!;
    public DbSet<MatrizRiesgoEntity> MatrizRiesgos { get; set; } = null!;
    public DbSet<AjusteEntity> Ajustes { get; set; } = null!;
    public DbSet<UsuarioEntity> Usuarios { get; set; } = null!;
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configurar Users
        modelBuilder.Entity<AppUser>(entity =>
        {
            entity.ToTable("users");
            entity.HasKey(e => e.Id);

            // Campos b�sicos
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Email).HasColumnName("email").IsRequired();
            entity.Property(e => e.FullName).HasColumnName("full_name");
            entity.Property(e => e.Role).HasColumnName("role").IsRequired().HasMaxLength(50);
            entity.Property(e => e.NombreEmpresa).HasColumnName("nombre_empresa");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
            entity.Property(e => e.UpdatedBy).HasColumnName("updated_by");
            // Campos de acceso a m�dulos
            entity.Property(e => e.AccessDashboard).HasColumnName("access_dashboard").HasDefaultValue(false);
            entity.Property(e => e.AccessEpid).HasColumnName("access_epid").HasDefaultValue(false);
            entity.Property(e => e.AccessRat).HasColumnName("access_rat").HasDefaultValue(false);
            entity.Property(e => e.AccessNormograma).HasColumnName("access_normograma").HasDefaultValue(false);
            entity.Property(e => e.AccessHabeasdata).HasColumnName("access_habeasdata").HasDefaultValue(false);
            entity.Property(e => e.AccessMatrizriesgo).HasColumnName("access_matrizriesgo").HasDefaultValue(false);
            entity.Property(e => e.AccessAjustes).HasColumnName("access_ajustes").HasDefaultValue(false);
            entity.Property(e => e.AccessUsuario).HasColumnName("access_usuario").HasDefaultValue(false);

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
            eb.ToTable("Habeas_Data");
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
        modelBuilder.Entity<NormativaEntity>(eb =>
        {
            eb.ToTable("Normativa");
            eb.HasKey(e => e.Id);
            eb.Property(e => e.Id).HasColumnName("id");
            eb.Property(e => e.Name).HasColumnName("name").IsRequired();
        });
        modelBuilder.Entity<SancionEntity>(eb =>
        {
            eb.ToTable("Sancion");
            eb.HasKey(e => e.Id);
            eb.Property(e => e.Id).HasColumnName("id");
            eb.Property(e => e.Name).HasColumnName("name").IsRequired();
        });
        modelBuilder.Entity<MatrizRiesgoEntity>(eb =>
        {
            eb.ToTable("Matriz_Riesgo");
            eb.HasKey(e => e.Id);
            eb.Property(e => e.Id).HasColumnName("id");
            eb.Property(e => e.Name).HasColumnName("name").IsRequired();
        });
        modelBuilder.Entity<AjusteEntity>(eb =>
        {
            eb.ToTable("Ajustes");
            eb.HasKey(e => e.Id);
            eb.Property(e => e.Id).HasColumnName("id");
            eb.Property(e => e.Name).HasColumnName("name").IsRequired();
        });
        modelBuilder.Entity<UsuarioEntity>(eb =>
        {
            eb.ToTable("User");
            eb.HasKey(e => e.Id);
            eb.Property(e => e.Id).HasColumnName("id");
            eb.Property(e => e.Name).HasColumnName("name").IsRequired();
        });

            // ... otras configuraciones
        }
}