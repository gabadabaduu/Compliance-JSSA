var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddScoped<Compliance.Core.Interfaces.IAuthService, Compliance.Infrastructure.Services.AuthService>();
builder.Services.AddScoped<Compliance.Core.Interfaces.IRatService, Compliance.Infrastructure.Services.RatService>();
builder.Services.AddScoped<Compliance.Core.Interfaces.IHabeasService, Compliance.Infrastructure.Services.HabeasService>();
builder.Services.AddScoped<Compliance.Core.Interfaces.IEpidService, Compliance.Infrastructure.Services.EpidService>();
builder.Services.AddScoped<Compliance.Core.Interfaces.INormogramaService, Compliance.Infrastructure.Services.NormogramaService>();
builder.Services.AddScoped<Compliance.Core.Interfaces.IDashboardService, Compliance.Infrastructure.Services.DashboardService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");
app.UseHttpsRedirection();
app.UseDefaultFiles();
app.UseStaticFiles();
app.UseAuthorization();
app.MapControllers();
app.MapFallbackToFile("index.html");

app.Run();