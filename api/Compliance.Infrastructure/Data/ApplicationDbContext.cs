using Microsoft.EntityFrameworkCore;
using Npgsql;
using Compliance.Core.Modules.User.Entities;
using Compliance.Infrastructure.Entities;
using Compliance.Infrastructure.Modules.Cumplimiento.Normativa.Entities;
using Compliance.Infrastructure.Modules.Cumplimiento.Sancion.Entities;
using Compliance.Infrastructure.Modules.Cumplimiento.RegTypes.Entities;
using Compliance.Infrastructure.Modules.Cumplimiento.RegDomains.Entities;
using Compliance.Infrastructure.Modules.Cumplimiento.RegAuthorities.Entities;
using Compliance.Infrastructure.Modules.Cumplimiento.RegIndustries.Entities;
using Compliance.Infrastructure.Modules.Cumplimiento.SncType.Entities;
using Compliance.Infrastructure.Modules.Cumplimiento.SncInfringements.Entities;
using Compliance.Infrastructure.Modules.Cumplimiento.SncResolutions.Entities;
using Compliance.Infrastructure.Modules.Cumplimiento.SncEntities.Entities;
using Compliance.Infrastructure.Modules.Cumplimiento.GeneralIndustries.Entities;
using Compliance.Core.Modules.Cumplimiento.Sancion.Dtos;
using Compliance.Infrastructure.Modules.DSR.Entities; // ✅ NUEVO

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

    // ✅ Catálogos de Regulaciones
    public DbSet<RegTypeEntity> RegTypes { get; set; } = null!;
    public DbSet<RegDomainEntity> RegDomains { get; set; } = null!;
    public DbSet<RegAuthorityEntity> RegAuthorities { get; set; } = null!;
    public DbSet<RegIndustryEntity> RegIndustries { get; set; } = null!;

    // ✅ Catálogos de Sanciones
    public DbSet<SncTypeEntity> SncTypes { get; set; } = null!;
    public DbSet<SncInfringementEntity> SncInfringements { get; set; } = null!;
    public DbSet<SncResolutionEntity> SncResolutions { get; set; } = null!;
    public DbSet<SncEntityEntity> SncEntities { get; set; } = null!;
    public DbSet<GeneralIndustryEntity> GeneralIndustries { get; set; } = null!;

    // ✅ NUEVO: Módulo DSR
    public DbSet<DsrEntity> Dsrs { get; set; } = null!;
    public DbSet<DsrRequestTypeEntity> DsrRequestTypes { get; set; } = null!;
    public DbSet<DsrStatusEntity> DsrStatuses { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // =====================================================
        // USERS
        // =====================================================

        modelBuilder.Entity<AppUser>(entity =>
        {
            entity.ToTable("users");
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Email).HasColumnName("email").IsRequired();
            entity.Property(e => e.FullName).HasColumnName("full_name");
            entity.Property(e => e.Role).HasColumnName("role").IsRequired().HasMaxLength(50);
            entity.Property(e => e.NombreEmpresa).HasColumnName("nombre_empresa");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
            entity.Property(e => e.UpdatedBy).HasColumnName("updated_by");

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

        // =====================================================
        // ENTIDADES SIMPLES
        // =====================================================

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

        // =====================================================
        // NORMATIVAS (STATUS COMO STRING)
        // =====================================================

        modelBuilder.Entity<NormativaEntity>(entity =>
        {
            entity.ToTable("regulations");
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Type).HasColumnName("type").IsRequired();
            entity.Property(e => e.Number).HasColumnName("number").IsRequired();
            entity.Property(e => e.IssueDate).HasColumnName("issue_date").IsRequired();
            entity.Property(e => e.Year).HasColumnName("year").IsRequired();
            entity.Property(e => e.Regulation).HasColumnName("regulation").IsRequired();
            entity.Property(e => e.CommonName).HasColumnName("common_name").IsRequired();
            entity.Property(e => e.Industry).HasColumnName("industry").IsRequired();
            entity.Property(e => e.Authority).HasColumnName("authority").IsRequired();
            entity.Property(e => e.Title).HasColumnName("title").IsRequired();
            entity.Property(e => e.Domain).HasColumnName("domain").IsRequired();

            entity.Property(e => e.Status)
                .HasColumnName("status")
                .IsRequired()
                .HasMaxLength(50);

            entity.Property(e => e.Url).HasColumnName("url");
        });

        // =====================================================
        // SANCIONES (ENUMS NATIVOS POSTGRESQL)
        // =====================================================

        modelBuilder.Entity<SancionEntity>(entity =>
        {
            entity.ToTable("sanctions");
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Number).HasColumnName("number").IsRequired();
            entity.Property(e => e.Entity).HasColumnName("entity").IsRequired();
            entity.Property(e => e.Facts).HasColumnName("facts").IsRequired();

            entity.Property(e => e.Stage)
                  .HasColumnName("stage")
                  .IsRequired();

            entity.Property(e => e.Status)
                  .HasColumnName("status")
                  .IsRequired();

            entity.Property(e => e.Initial).HasColumnName("initial");
            entity.Property(e => e.Reconsideration).HasColumnName("reconsideration");
            entity.Property(e => e.Appeal).HasColumnName("appeal");
        });

        // =====================================================
        // CATÁLOGOS DE REGULACIONES
        // =====================================================

        modelBuilder.Entity<RegTypeEntity>(eb =>
        {
            eb.ToTable("reg_types");
            eb.HasKey(e => e.Id);
            eb.Property(e => e.Id).HasColumnName("id");
            eb.Property(e => e.Type).HasColumnName("type").IsRequired();
        });

        modelBuilder.Entity<RegDomainEntity>(eb =>
        {
            eb.ToTable("reg_domains");
            eb.HasKey(e => e.Id);
            eb.Property(e => e.Id).HasColumnName("id");
            eb.Property(e => e.Name).HasColumnName("name").IsRequired();
        });

        modelBuilder.Entity<RegAuthorityEntity>(eb =>
        {
            eb.ToTable("reg_authorities");
            eb.HasKey(e => e.Id);
            eb.Property(e => e.Id).HasColumnName("id");
            eb.Property(e => e.Name).HasColumnName("name").IsRequired();
        });

        modelBuilder.Entity<RegIndustryEntity>(eb =>
        {
            eb.ToTable("reg_industries");
            eb.HasKey(e => e.Id);
            eb.Property(e => e.Id).HasColumnName("id");
            eb.Property(e => e.Name).HasColumnName("name").IsRequired();
        });

        // =====================================================
        // CATÁLOGOS DE SANCIONES
        // =====================================================

        modelBuilder.Entity<SncTypeEntity>(eb =>
        {
            eb.ToTable("snc_type");
            eb.HasKey(e => e.Id);
            eb.Property(e => e.Id).HasColumnName("id");
            eb.Property(e => e.Name).HasColumnName("name").IsRequired();
        });

        modelBuilder.Entity<SncInfringementEntity>(eb =>
        {
            eb.ToTable("snc_infringements");
            eb.HasKey(e => e.Id);
            eb.Property(e => e.Id).HasColumnName("id");
            eb.Property(e => e.Statute).HasColumnName("statute").IsRequired();
            eb.Property(e => e.Article).HasColumnName("article").IsRequired();
            eb.Property(e => e.Section).HasColumnName("section").IsRequired();
            eb.Property(e => e.Description).HasColumnName("description").IsRequired();
            eb.Property(e => e.Interpretation).HasColumnName("interpretation").IsRequired();
        });

        modelBuilder.Entity<SncResolutionEntity>(eb =>
        {
            eb.ToTable("snc_resolutions");
            eb.HasKey(e => e.Id);
            eb.Property(e => e.Id).HasColumnName("id");
            eb.Property(e => e.Sanctions).HasColumnName("sanctions").IsRequired();
            eb.Property(e => e.Number).HasColumnName("number").IsRequired();
            eb.Property(e => e.IssueDate).HasColumnName("issue_date").IsRequired();
            eb.Property(e => e.Year).HasColumnName("year").IsRequired();
            eb.Property(e => e.Resolution).HasColumnName("resolution").IsRequired();
            eb.Property(e => e.ResolutionType).HasColumnName("resolution_type").IsRequired();
            eb.Property(e => e.Infringements).HasColumnName("infringements").IsRequired();
            eb.Property(e => e.LegalGrounds).HasColumnName("legal_grounds").IsRequired();
            eb.Property(e => e.SanctionType).HasColumnName("sanction_type").IsRequired();
            eb.Property(e => e.Amount).HasColumnName("amount").IsRequired();
            eb.Property(e => e.Description).HasColumnName("description").IsRequired();
            eb.Property(e => e.Outcome).HasColumnName("outcome").IsRequired().HasMaxLength(50);
            eb.Property(e => e.Orders).HasColumnName("orders").IsRequired();
            eb.Property(e => e.Attachment).HasColumnName("attachment");
            eb.Property(e => e.Url).HasColumnName("url");
        });

        modelBuilder.Entity<SncEntityEntity>(eb =>
        {
            eb.ToTable("snc_entities");
            eb.HasKey(e => e.Id);
            eb.Property(e => e.Id).HasColumnName("id");
            eb.Property(e => e.Name).HasColumnName("name").IsRequired();
            eb.Property(e => e.TaxId).HasColumnName("tax_id").IsRequired();
            eb.Property(e => e.Industry).HasColumnName("industry").IsRequired();
            eb.Property(e => e.CompanySize).HasColumnName("company_size").IsRequired();
        });

        modelBuilder.Entity<GeneralIndustryEntity>(eb =>
        {
            eb.ToTable("general_industries");
            eb.HasKey(e => e.Id);
            eb.Property(e => e.Id).HasColumnName("id");
            eb.Property(e => e.Name).HasColumnName("name").IsRequired();
        });

        // =====================================================
        // ✅ NUEVO: MÓDULO DSR
        // =====================================================

        modelBuilder.Entity<DsrRequestTypeEntity>(eb =>
        {
            eb.ToTable("dsr_request_type");
            eb.HasKey(e => e.Id);
            eb.Property(e => e.Id).HasColumnName("id");
            eb.Property(e => e.Type).HasColumnName("type").IsRequired();
            eb.Property(e => e.Category).HasColumnName("category");
            eb.Property(e => e.InitialTerm).HasColumnName("initial_term");
            eb.Property(e => e.InitialTermDescription).HasColumnName("initial_term_description");
            eb.Property(e => e.ExtensionTerm).HasColumnName("extension_term");
            eb.Property(e => e.ExtensionTermDescription).HasColumnName("extension_term_description");
        });

        modelBuilder.Entity<DsrStatusEntity>(eb =>
        {
            eb.ToTable("dsr_status");
            eb.HasKey(e => e.Id);
            eb.Property(e => e.Id).HasColumnName("id");
            eb.Property(e => e.WorkflowStatus).HasColumnName("workflow_status").IsRequired();
            eb.Property(e => e.CaseStatus).HasColumnName("case_status").IsRequired();
        });

        modelBuilder.Entity<DsrEntity>(eb =>
        {
            eb.ToTable("dsr");
            eb.HasKey(e => e.Id);
            eb.Property(e => e.Id).HasColumnName("id");
            eb.Property(e => e.CaseId).HasColumnName("case_id").IsRequired();
            eb.Property(e => e.RequestId).HasColumnName("request_id").IsRequired();
            eb.Property(e => e.Type).HasColumnName("type").IsRequired();
            eb.Property(e => e.Category).HasColumnName("category").IsRequired();
            eb.Property(e => e.FullName).HasColumnName("full_name").IsRequired();
            eb.Property(e => e.IdType).HasColumnName("id_type").IsRequired();
            eb.Property(e => e.IdNumber).HasColumnName("id_number").IsRequired();
            eb.Property(e => e.Email).HasColumnName("email").IsRequired();
            eb.Property(e => e.RequestDetails).HasColumnName("request_details").IsRequired();
            eb.Property(e => e.Attachment).HasColumnName("attachment").HasMaxLength(30);
            eb.Property(e => e.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("NOW()");
            eb.Property(e => e.StartDate).HasColumnName("start_date").IsRequired();
            eb.Property(e => e.DueDate).HasColumnName("due_date").IsRequired();
            eb.Property(e => e.Stage).HasColumnName("stage");
            eb.Property(e => e.Status).HasColumnName("status");
            eb.Property(e => e.InitialTerm).HasColumnName("initial_term").IsRequired();
            eb.Property(e => e.ExtensionTerm).HasColumnName("extension_term").HasDefaultValue(false);
            eb.Property(e => e.TotalTerm).HasColumnName("total_term").IsRequired();
            eb.Property(e => e.ClosedAt).HasColumnName("closed_at");
            eb.Property(e => e.ResponseContent).HasColumnName("response_content");
            eb.Property(e => e.ResponseAttachment).HasColumnName("response_attachment").HasDefaultValue(false);
        });

        // =====================================================
        // OTRAS
        // =====================================================

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

        base.OnModelCreating(modelBuilder);
    }
}