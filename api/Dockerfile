FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["Compliance.Web/Compliance. Web.csproj", "Compliance.Web/"]
COPY ["Compliance.Core/Compliance.Core.csproj", "Compliance.Core/"]
COPY ["Compliance.Infrastructure/Compliance.Infrastructure.csproj", "Compliance.Infrastructure/"]

RUN dotnet restore "Compliance.Web/Compliance.Web.csproj"

COPY .  .

WORKDIR "/Compliance.Web"
RUN dotnet build "Compliance.Web.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Compliance.Web.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

ENTRYPOINT ["sh", "-c", "export ASPNETCORE_URLS=http://+:${PORT:-8080} && exec dotnet Compliance.Web.dll"]