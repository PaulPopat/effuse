using System.Runtime.Loader;
using Effuse.Core.Integrations;
using Effuse.Server.Errors;
using Effuse.Server.Integrations;
using Effuse.Server.Startup;
using Microsoft.Data.Sqlite;
using Npgsql;
using SqlKata.Compilers;
using SqlKata.Execution;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddCors(options =>
{
  options.AddPolicy
  (
    name: Cors.EffuseOrigins,
    policy =>
    {
      policy
        .WithOrigins(Env.GetEnvironmentVariable("UI_ORIGIN"))
        .AllowAnyHeader()
        .AllowAnyMethod();
    }
  );
});

switch (Env.GetEnvironmentVariable("DATABASE_PROVIDER"))
{
  case "sqlite":
    builder.Services.AddTransient(e => new QueryFactory
    (
        new SqliteConnection
        (
            string.Format("DataSource={0}", Env.GetEnvironmentVariable("SQLITE_FILE"))
        ),
        new SqliteCompiler()
    ));
    break;
  case "postgres":
    builder.Services.AddTransient(e => new QueryFactory
    (
        new NpgsqlConnection
        (
            string.Format
            (
                "Host={0};Username={1};Password={2};Database={3}",
                Env.GetEnvironmentVariable("POSTGRES_HOST"),
                Env.GetEnvironmentVariable("POSTGRES_USER"),
                Env.GetEnvironmentVariable("POSTGRES_PASSWORD"),
                Env.GetEnvironmentVariable("POSTGRES_DB")
            )
        ),
        new PostgresCompiler()
    ));
    break;
}


builder.Services.AddSingleton<GuidService>();
builder.Services.AddSingleton<DateTimeService>();
builder.Services.AddSingleton<JwtService>();
builder.Services.AddSingleton<IJwtConfig, EnvService>();
builder.Services.AddSingleton<IEnvService, EnvService>();
builder.Services.AddTransient<IRoleRepository, RoleRepository>();
builder.Services.AddTransient<ITokenService, TokenService>();
builder.Services.AddTransient<IUserRepository, UserRepository>();

builder.Services.AddHttpContextAccessor();
builder.Services.AddExceptionHandler<ApiErrorExceptionHandler>();
builder.Services.AddControllers();

var app = builder.Build();

app.UseWebSockets();
app.UseAuthorization();

app.UseCors(Cors.EffuseOrigins);
app.MapControllers();

// This is non blocking and should not be a concern
#pragma warning disable CS4014
app.Services.GetRequiredService<DefaultInviter>().CreateStartupInvite();
#pragma warning restore CS4014

app.Run();
