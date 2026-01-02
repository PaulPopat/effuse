using System.Net;
using System.Net.Mail;
using Effuse.Auth.Integrations;
using Microsoft.Data.Sqlite;
using SqlKata.Compilers;
using SqlKata.Execution;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddTransient(e => new QueryFactory
(
    new SqliteConnection("DataSource=/appdata/database.sqlite"), new SqliteCompiler()
));
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
