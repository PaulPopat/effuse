using System.Net;
using System.Net.Mail;
using Effuse.Auth.Integrations;
using Microsoft.Data.Sqlite;
using SqlKata.Compilers;
using SqlKata.Execution;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddTransient(e => new QueryFactory
(
    new SqliteConnection("/data/database.sqlite"), new SqliteCompiler()
));
builder.Services.AddSingleton(typeof(Env));
builder.Services.AddSingleton(typeof(GuidService));
builder.Services.AddSingleton(typeof(PasswordHasher));
builder.Services.AddTransient(typeof(UserRepository), typeof(IUserRepository));
builder.Services.AddTransient(e =>
{
    return new SmtpClient
    {
        Credentials = new NetworkCredential
        (
            Environment.GetEnvironmentVariable("SMTP_USERNAME"),
            Environment.GetEnvironmentVariable("SMTP_PASSWORD")
        ),
        UseDefaultCredentials = false,
    };
});

// Add services to the container.

builder.Services.AddControllers();

var app = builder.Build();

app.UseAuthorization();

app.MapControllers();

app.Run();
