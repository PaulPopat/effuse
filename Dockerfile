FROM mcr.microsoft.com/dotnet/sdk:10.0-alpine AS build

WORKDIR /app

COPY . .

RUN dotnet restore

WORKDIR /app/Effuse.Auth

RUN dotnet publish -o out

WORKDIR /app/Effuse.Server

RUN dotnet publish -o out

FROM mcr.microsoft.com/dotnet/aspnet:10.0-alpine as runner

RUN apk add --update nodejs npm

WORKDIR /entry
COPY ./docker-startup.sh ./docker-startup.sh
RUN chmod +x ./docker-startup.sh

EXPOSE 8080

ENTRYPOINT [ "/entry/docker-startup.sh" ]

FROM runner AS auth

COPY ./Effuse.AuthMigration /migrations

WORKDIR /migrations
RUN npm install

COPY --from=build /app/Effuse.Auth/out /app
ENV APP_FILE="/app/Effuse.Auth"

FROM runner AS server

ENV SQLITE_FILE=/data/db.sqlite

COPY ./Effuse.ServerMigration /migrations

WORKDIR /migrations
RUN npm install

COPY --from=build /app/Effuse.Server/out /app
ENV APP_FILE="/app/Effuse.Server"
