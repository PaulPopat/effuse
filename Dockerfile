FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

WORKDIR /app

COPY . .

RUN dotnet restore

WORKDIR /app/Effuse.Auth

RUN dotnet publish -o out

WORKDIR /app/Effuse.Server

RUN dotnet publish -o out

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS auth

WORKDIR /app

EXPOSE 8080

COPY --from=build /app/Effuse.Auth/out .
ENTRYPOINT ["./Effuse.Auth"]

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS server

WORKDIR /app

EXPOSE 8080

COPY --from=build /app/Effuse.Server/out .
ENTRYPOINT ["./Effuse.Server"]

FROM node:alpine AS auth_migration

COPY ./Effuse.AuthMigration /app

WORKDIR /app

RUN npm install

ENTRYPOINT [ "npm", "run", "migrate:latest" ]

FROM node:alpine AS server_migration

COPY ./Effuse.ServerMigration /app

WORKDIR /app

RUN npm install

ENTRYPOINT [ "npm", "run", "migrate:latest" ]