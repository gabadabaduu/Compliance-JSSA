using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json.Serialization;
using Compliance.Infrastructure.Data;
using Compliance.Core.Modules.EPID.Interfaces;
using Compliance.Infrastructure.Modules.EPID.Repositories;
using Compliance.Infrastructure.Modules.EPID.Services;
using Compliance.Core.Modules.HabeasData.Interfaces;
using Compliance.Infrastructure.Modules.HabeasData.Repositories;
using Compliance.Infrastructure.Modules.HabeasData.Services;
using Compliance.Core.Modules.RAT.Interfaces;
using Compliance.Infrastructure.Modules.RAT.Repositories;
using Compliance.Infrastructure.Modules.RAT.Services;
using Compliance.Core.Modules.Cumplimiento.Normativa.Interfaces;
using Compliance.Infrastructure.Modules.Cumplimiento.Normativa.Repositories;
using Compliance.Infrastructure.Modules.Cumplimiento.Normativa.Services;
using Compliance.Core.Modules.Cumplimiento.Sancion.Interfaces;
using Compliance.Infrastructure.Modules.Cumplimiento.Sancion.Repositories;
using Compliance.Infrastructure.Modules.Cumplimiento.Sancion.Services;
using Compliance.Core.Modules.Cumplimiento.RegTypes.Interfaces;
using Compliance.Infrastructure.Modules.Cumplimiento.RegTypes.Repositories;
using Compliance.Infrastructure.Modules.Cumplimiento.RegTypes.Services;
using Compliance.Core.Modules.Cumplimiento.RegDomains.Interfaces;
using Compliance.Infrastructure.Modules.Cumplimiento.RegDomains.Repositories;
using Compliance.Infrastructure.Modules.Cumplimiento.RegDomains.Services;
using Compliance.Core.Modules.Cumplimiento.RegAuthorities.Interfaces;
using Compliance.Infrastructure.Modules.Cumplimiento.RegAuthorities.Repositories;
using Compliance.Infrastructure.Modules.Cumplimiento.RegAuthorities.Services;
using Compliance.Core.Modules.Cumplimiento.RegIndustries.Interfaces;
using Compliance.Infrastructure.Modules.Cumplimiento.RegIndustries.Repositories;
using Compliance.Infrastructure.Modules.Cumplimiento.RegIndustries.Services;
using Compliance.Core.Modules.Cumplimiento.SncType.Interfaces;
using Compliance.Infrastructure.Modules.Cumplimiento.SncType.Repositories;
using Compliance.Infrastructure.Modules.Cumplimiento.SncType.Services;
using Compliance.Core.Modules.Cumplimiento.SncInfringements.Interfaces;
using Compliance.Infrastructure.Modules.Cumplimiento.SncInfringements.Repositories;
using Compliance.Infrastructure.Modules.Cumplimiento.SncInfringements.Services;
using Compliance.Core.Modules.Cumplimiento.SncResolutions.Interfaces;
using Compliance.Infrastructure.Modules.Cumplimiento.SncResolutions.Repositories;
using Compliance.Infrastructure.Modules.Cumplimiento.SncResolutions.Services;
using Compliance.Core.Modules.Cumplimiento.SncEntities.Interfaces;
using Compliance.Infrastructure.Modules.Cumplimiento.SncEntities.Repositories;
using Compliance.Infrastructure.Modules.Cumplimiento.SncEntities.Services;
using Compliance.Core.Modules.Cumplimiento.GeneralIndustries.Interfaces;
using Compliance.Infrastructure.Modules.Cumplimiento.GeneralIndustries.Repositories;
using Compliance.Infrastructure.Modules.Cumplimiento.GeneralIndustries.Services;
using Compliance.Core.Modules.MatrizRiesgo.Interfaces;
using Compliance.Infrastructure.Modules.MatrizRiesgo.Repositories;
using Compliance.Infrastructure.Modules.MatrizRiesgo.Services;
using Compliance.Core.Modules.Ajustes.Interfaces;
using Compliance.Infrastructure.Modules.Ajustes.Repositories;
using Compliance.Infrastructure.Modules.Ajustes.Services;
using Compliance.Core.Modules.Usuario.Interfaces;
using Compliance.Infrastructure.Modules.Usuario.Repositories;
using Compliance.Infrastructure.Modules.Usuario.Services;
using Compliance.Core.Modules.DSR.Interfaces;
using Compliance.Infrastructure.Modules.DSR.Repositories;
using Compliance.Infrastructure.Modules.DSR.Services;
using Compliance.Core.Modules.ROPA.Interfaces;
using Compliance.Infrastructure.Modules.ROPA.Repositories;
using Compliance.Infrastructure.Modules.ROPA.Services;
using Compliance.Web.Hubs;
using Compliance.Core.Modules.HabeasData.Notificacion.Interfaces;
using Compliance.Infrastructure.Modules.HabeasData.Notificacion.Repositories;
using Compliance.Infrastructure.Modules.HabeasData.Notificacion.Services;
using Compliance.Infrastructure.ExternalServices.Email;
using Compliance.Infrastructure.BackgroundJobs;
// Limpiar mapeo de claim types
Microsoft.IdentityModel.JsonWebTokens.JsonWebTokenHandler.DefaultInboundClaimTypeMap.Clear();
System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000", "https://compliance-frontend-6oo9.onrender.com")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Módulos principales
builder.Services.AddScoped<IEpidRepository, EpidRepository>();
builder.Services.AddScoped<IEpidService, EpidService>();
builder.Services.AddScoped<IHabeasDataRepository, HabeasDataRepository>();
builder.Services.AddScoped<IHabeasDataService, HabeasDataService>();
builder.Services.AddScoped<IRatRepository, RatRepository>();
builder.Services.AddScoped<IRatService, RatService>();
builder.Services.AddScoped<INormativaRepository, NormativaRepository>();
builder.Services.AddScoped<INormativaService, NormativaService>();
builder.Services.AddScoped<ISancionRepository, SancionRepository>();
builder.Services.AddScoped<ISancionService, SancionService>();
builder.Services.AddScoped<IMatrizRiesgoRepository, MatrizRiesgoRepository>();
builder.Services.AddScoped<IMatrizRiesgoService, MatrizRiesgoService>();
builder.Services.AddScoped<IAjusteRepository, AjusteRepository>();
builder.Services.AddScoped<IAjusteService, AjusteService>();
builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>();
builder.Services.AddScoped<IUsuarioService, UsuarioService>();

// ✅ Catálogos de Regulaciones
builder.Services.AddScoped<IRegTypeRepository, RegTypeRepository>();
builder.Services.AddScoped<IRegTypeService, RegTypeService>();
builder.Services.AddScoped<IRegDomainRepository, RegDomainRepository>();
builder.Services.AddScoped<IRegDomainService, RegDomainService>();
builder.Services.AddScoped<IRegAuthorityRepository, RegAuthorityRepository>();
builder.Services.AddScoped<IRegAuthorityService, RegAuthorityService>();
builder.Services.AddScoped<IRegIndustryRepository, RegIndustryRepository>();
builder.Services.AddScoped<IRegIndustryService, RegIndustryService>();

// ✅ Catálogos de Sanciones
builder.Services.AddScoped<ISncTypeRepository, SncTypeRepository>();
builder.Services.AddScoped<ISncTypeService, SncTypeService>();
builder.Services.AddScoped<ISncInfringementRepository, SncInfringementRepository>();
builder.Services.AddScoped<ISncInfringementService, SncInfringementService>();
builder.Services.AddScoped<ISncResolutionRepository, SncResolutionRepository>();
builder.Services.AddScoped<ISncResolutionService, SncResolutionService>();
builder.Services.AddScoped<ISncEntityRepository, SncEntityRepository>();
builder.Services.AddScoped<ISncEntityService, SncEntityService>();
builder.Services.AddScoped<IGeneralIndustryRepository, GeneralIndustryRepository>();
builder.Services.AddScoped<IGeneralIndustryService, GeneralIndustryService>();

// Módulo DSR 
builder.Services.AddScoped<IDsrRepository, DsrRepository>();
builder.Services.AddScoped<IDsrService, DsrService>();
builder.Services.AddScoped<IDsrRequestTypeRepository, DsrRequestTypeRepository>();
builder.Services.AddScoped<IDsrRequestTypeService, DsrRequestTypeService>();
builder.Services.AddScoped<IDsrStatusRepository, DsrStatusRepository>();
builder.Services.AddScoped<IDsrStatusService, DsrStatusService>();
builder.Services.AddScoped<IDsrNotificationRepository, DsrNotificationRepository>();
builder.Services.AddScoped<IDsrNotificationService, DsrNotificationService>();
builder.Services.AddScoped<IEmailService, MailjetEmailService>();
builder.Services.AddScoped<IDsrNotificationHubService, DsrNotificationHubService>();
builder.Services.AddHostedService<DsrNotificationJob>();

// ✅ NUEVO: Módulo ROPA
builder.Services.AddScoped<IRopaDataStorageRepository, RopaDataStorageRepository>();
builder.Services.AddScoped<IRopaDataStorageService, RopaDataStorageService>();
builder.Services.AddScoped<IRopaEntityRepository, RopaEntityRepository>();
builder.Services.AddScoped<IRopaEntityService, RopaEntityService>();
builder.Services.AddScoped<IRopaContractRepository, RopaContractRepository>();
builder.Services.AddScoped<IRopaContractService, RopaContractService>();
builder.Services.AddScoped<IRopaDepartmentRepository, RopaDepartmentRepository>();
builder.Services.AddScoped<IRopaDepartmentService, RopaDepartmentService>();
builder.Services.AddScoped<IContactChannelRepository, ContactChannelRepository>();
builder.Services.AddScoped<IContactChannelService, ContactChannelService>();

// JWT Authentication
var jwtSecret = builder.Configuration["Supabase:JwtSecret"];

if (string.IsNullOrEmpty(jwtSecret))
{
    throw new InvalidOperationException("❌ ERROR CRÍTICO:  Jwt:  Secret no está configurado.");
}

var key = Encoding.UTF8.GetBytes(jwtSecret);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;
        options.MapInboundClaims = false;

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = true,
            ValidIssuer = "https://zyzmaaeoutsfstapbgmc.supabase.co/auth/v1",
            ValidateAudience = true,
            ValidAudience = "authenticated",
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero,
            NameClaimType = "sub",
            RoleClaimType = "role"
        };

        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];
                var path = context.HttpContext.Request.Path;
                if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs"))
                {
                    context.Token = accessToken;
                }
                return Task.CompletedTask;
            },

            OnTokenValidated = context =>
            {
                var userId = context.Principal?.FindFirst("sub")?.Value;
                var email = context.Principal?.FindFirst("email")?.Value;
                Console.WriteLine($"✅ TOKEN VÁLIDO - User ID: {userId}, Email: {email}");
                return Task.CompletedTask;
            },
            OnAuthenticationFailed = context =>
            {
                Console.WriteLine($"❌ Auth failed: {context.Exception.Message}");
                return Task.CompletedTask;
            }
        };
    });

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapHub<NotificationHub>("/hubs/notifications");
app.MapControllers();

Console.WriteLine("🚀 Backend corriendo en http://localhost:5000");

app.Run();