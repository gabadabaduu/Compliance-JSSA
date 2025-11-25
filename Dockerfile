FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
# EXPOSE is optional for Render; leave for documentation only
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copiar archivos de proyecto
COPY ["src/Compliance.Web/Compliance.Web.csproj", "Compliance.Web/"]
COPY ["src/Compliance.Core/Compliance.Core.csproj", "Compliance.Core/"]
COPY ["src/Compliance.Infrastructure/Compliance.Infrastructure.csproj", "Compliance.Infrastructure/"]

# Restaurar dependencias
RUN dotnet restore "Compliance.Web/Compliance.Web.csproj"

# Copiar todo el código
COPY src/ .

# Build
WORKDIR "/src/Compliance.Web"
RUN dotnet build "Compliance.Web.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Compliance.Web.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# At runtime, use the PORT env var (provided by Render). If not set, fallback to 8080.
# Use sh -c so the shell expands ${PORT} and then exec replaces the shell with dotnet process.
ENTRYPOINT ["sh", "-c", "export ASPNETCORE_URLS=http://+:${PORT:-8080} && exec dotnet Compliance.Web.dll"]