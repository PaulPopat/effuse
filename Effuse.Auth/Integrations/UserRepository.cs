using System.Net.Mail;
using System.Text;
using Effuse.Auth.Domain;
using Effuse.Auth.Errors;
using Effuse.Auth.Integrations.Props;
using Effuse.Auth.Integrations.Tables;
using SqlKata.Execution;

namespace Effuse.Auth.Integrations;

public class UserRepository
(
    QueryFactory db,
    PasswordHasher passwordHasher,
    GuidService guidService,
    DateTimeService dateTimeService,
    SmtpClient client,
    Env env
) : IUserRepository
{
    public async Task StageUser(string email)
    {
        var id = guidService.NewGuid;

        await db.Query(StagedUserRow.Table).InsertAsync(new StagedUserRow
        {
            id = id,
            email = email
        });

        var messageBuilder = new StringBuilder(env.VerificationEmailBody);
        messageBuilder.Replace("$TOKEN", id.ToString());

        var message = new MailMessage(env.EmailFrom, email)
        {
            Subject = env.VerificationEmailSubject,
            Body = messageBuilder.ToString(),
        };

        client.Send(message);
    }

    public async Task<User> CreateUser(CreateUserProps props)
    {
        var stagingResult = await db.Query(StagedUserRow.Table).Select("*").Where("email", props.Email).GetAsync<StagedUserRow>();
        var staged = stagingResult.First();
        if (staged == null || staged.id != props.Verification)
        {
            throw new UnauthorisedError("CreateUser", "InvalidVerification");
        }

        var existingEmail = await db.Query(UserRow.Table).Select("*").Where("email", props.Email).GetAsync<UserRow>();
        if (existingEmail.Any())
        {
            throw new ConflictError("CreateUser", "Email");
        }

        var existingUsername = await db.Query(UserRow.Table).Select("*").Where("username", props.Username).GetAsync<UserRow>();
        if (existingUsername.Any())
        {
            throw new ConflictError("CreateUser", "Username");
        }

        var id = guidService.NewGuid;
        var hashed_password = passwordHasher.Hash(props.Password);
        var now = dateTimeService.Now;

        await db.Query(UserRow.Table).InsertAsync(new UserRow
        {
            id = id,
            username = props.Username,
            email = props.Email,
            hashed_password = hashed_password,
            created_on = now,
            updated_on = now
        });

        return new
        (
            id: id,
            username: props.Username,
            email: props.Email,
            created_on: now,
            updated_on: now
        );
    }

    public async Task<User> GetUser(string userId)
    {
        var entries = await db.Query(UserRow.Table).Select("*").Where("users.id", userId).GetAsync<UserRow>();
        if (!entries.Any())
        {
            throw new NotFoundError("GetUser", userId);
        }

        var row = entries.Single();
        return new
        (
            id: row.id,
            username: row.username,
            email: row.email,
            created_on: row.created_on,
            updated_on: row.updated_on
        );
    }
}