using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
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
using Compliance.Core.Modules.Normograma.Interfaces;
using Compliance.Infrastructure.Modules.Normograma.Repositories;
using Compliance.Infrastructure.Modules.Normograma.Services;
using Compliance.Core.Modules.MatrizRiesgo.Interfaces;
using Compliance.Infrastructure.Modules.MatrizRiesgo.Repositories;
using Compliance.Infrastructure.Modules.MatrizRiesgo.Services;
using Compliance.Core.Modules.Ajustes.Interfaces;
using Compliance.Infrastructure.Modules.Ajustes.Repositories;
using Compliance.Infrastructure.Modules.Ajustes.Services;
using Compliance.Core.Modules.Usuario.Interfaces;
using Compliance.Infrastructure.Modules.Usuario.Repositories;
using Compliance.Infrastructure.Modules.Usuario.Services;

// Limpiar mapeo de claim types para usar nombres cortos
Microsoft.IdentityModel.JsonWebTokens.JsonWebTokenHandler.DefaultInboundClaimTypeMap.Clear();
System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS
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
builder.Services.AddScoped<IEpidRepository, EpidRepository>();
builder.Services.AddScoped<IEpidService, EpidService>();
builder.Services.AddScoped<IHabeasDataRepository, HabeasDataRepository>();
builder.Services.AddScoped<IHabeasDataService, HabeasDataService>();
builder.Services.AddScoped<IRatRepository, RatRepository>();
builder.Services.AddScoped<IRatService, RatService>();
builder.Services.AddScoped<INormogramaRepository, NormogramaRepository>();
builder.Services.AddScoped<INormogramaService, NormogramaService>();
builder.Services.AddScoped<IMatrizRiesgoRepository, MatrizRiesgoRepository>();
builder.Services.AddScoped<IMatrizRiesgoService, MatrizRiesgoService>();
builder.Services.AddScoped<IAjusteRepository, AjusteRepository>();
builder.Services.AddScoped<IAjusteService, AjusteService>();
builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>();
builder.Services.AddScoped<IUsuarioService, UsuarioService>();

// JWT Authentication
var jwtSecret = builder.Configuration["Jwt:Secret"];

if (string.IsNullOrEmpty(jwtSecret))
{
    throw new InvalidOperationException("❌ ERROR CRÍTICO: Jwt:Secret no está configurado.  La aplicación no puede iniciar sin autenticación.");
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
        options.MapInboundClaims = false; // No mapear claim types a nombres largos

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
app.MapControllers();

Console.WriteLine("🚀 Backend corriendo en http://localhost:5000");

app.Run();