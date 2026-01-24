FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

WORKDIR /app

COPY . .

RUN dotnet restore

WORKDIR /app/Effuse.Auth

RUN dotnet publish -o out

WORKDIR /app/Effuse.Server

RUN dotnet publish -o out

FROM mcr.microsoft.com/dotnet/aspnet:10.0 as runner

RUN apt-get install nodejs -y

COPY ./docker-start.sh /docker-start.sh

FROM runner AS auth

COPY ./Effuse.AuthMigration /migrations

WORKDIR /migrations
RUN npm install

WORKDIR /app

EXPOSE 8080

COPY --from=build /app/Effuse.Auth/out .

ENTRYPOINT ["/docker-start.sh", "./Effuse.Auth"]

FROM runner AS server

COPY ./Effuse.ServerMigration /migrations

WORKDIR /migrations
RUN npm install

WORKDIR /app

EXPOSE 8080

COPY --from=build /app/Effuse.Server/out .
ENTRYPOINT ["/docker-start.sh", "./Effuse.Server"]
