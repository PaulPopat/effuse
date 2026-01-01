using Microsoft.Data.Sqlite;
using SqlKata.Compilers;
using SqlKata.Execution;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddTransient(e => new QueryFactory(
    new SqliteConnection("/data/database.sqlite"), new SqliteCompiler()));

// Add services to the container.

builder.Services.AddControllers();

var app = builder.Build();

app.UseAuthorization();

app.MapControllers();

app.Run();
