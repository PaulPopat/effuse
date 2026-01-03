using System.Net;
using System.Net.Mail;
using Effuse.Auth.Integrations;
using Microsoft.Data.Sqlite;
using Npgsql;
using SqlKata.Compilers;
using SqlKata.Execution;

var builder = WebApplication.CreateBuilder(args);

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
builder.Services.AddSingleton(typeof(Env));
builder.Services.AddSingleton(typeof(GuidService));
builder.Services.AddSingleton(typeof(DateTimeService));
builder.Services.AddSingleton(typeof(PasswordHasher));
builder.Services.AddTransient(typeof(IUserRepository), typeof(UserRepository));
builder.Services.AddTransient(e =>
{
    return new SmtpClient
    (
        Env.GetEnvironmentVariable("SMTP_HOST"),
        int.Parse(Env.GetEnvironmentVariable("SMTP_PORT"))
    )
    {
        Credentials = new NetworkCredential
        (
            Env.GetEnvironmentVariable("SMTP_USERNAME"),
            Env.GetEnvironmentVariable("SMTP_PASSWORD")
        ),
        UseDefaultCredentials = false,
    };
});

builder.Services.AddControllers();

var app = builder.Build();

app.MapControllers();

app.Run();
