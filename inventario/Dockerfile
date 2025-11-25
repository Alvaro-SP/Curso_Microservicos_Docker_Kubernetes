#! TECNICA MULTI STAGE DE CONSTRUCCION DE IMAGENES DOCKER

# * stage de build el cual compila la app
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY inventario.csproj .
RUN dotnet restore

# copiar todo el codigo y compilar
COPY . .
RUN dotnet publish -c Release -o /app/publish

# * stage final el cual corre la app
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://0.0.0.0:5002

EXPOSE 5002
ENTRYPOINT ["dotnet", "inventario.dll"]