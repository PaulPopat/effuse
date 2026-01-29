using System.Net.Mail;
using System.Text;
using Effuse.Auth.Domain;
using Effuse.Auth.Integrations.Props;
using Effuse.Auth.Integrations.Tables;
using Effuse.Core.Errors;
using Effuse.Core.Integrations;
using Effuse.Core.Utils;
using SqlKata.Execution;

namespace Effuse.Auth.Integrations;

public class UserRepository
(
    QueryFactory db,
    PasswordHasher passwordHasher,
    GuidService guidService,
    DateTimeService dateTimeService,
    SmtpClient client,
    EnvService env
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
        messageBuilder.Replace("$EFFUSE_BASE", env.UserInterfaceOrigin);
        messageBuilder.Replace("$TOKEN", id.ToString());
        messageBuilder.Replace("$EMAIL", email);

        var message = new MailMessage(env.EmailFrom, email)
        {
            Subject = env.VerificationEmailSubject,
            Body = messageBuilder.ToString(),
            IsBodyHtml = true,
        };

        client.Send(message);
    }

    public async Task<User> CreateUser(CreateUserProps props)
    {
        var staged = await db
            .Query(StagedUserRow.Table)
            .Select("*")
            .Where("email", props.Email)
            .SafeGet<StagedUserRow>();
        if (staged == null || !staged.Any(s => s.id == props.Verification))
        {
            throw new UnauthorisedError("CreateUser", "InvalidVerification");
        }

        var existingEmail = await db.Query(UserRow.Table).Select("*").Where("email", props.Email).SafeFirstOrDefault<UserRow>();
        if (existingEmail != null)
        {
            throw new ConflictError("CreateUser", "Email");
        }

        var existingUsername = await db.Query(UserRow.Table).Select("*").Where("username", props.Username).SafeFirstOrDefault<UserRow>();
        if (existingUsername != null)
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

    public async Task<User> GetUser(Guid userId)
    {
        var row = await db.Query(UserRow.Table).Select("*").Where("users.id", userId).SafeFirstOrDefault<UserRow>();
        if (row == null)
        {
            throw new NotFoundError("GetUser", userId.ToString());
        }

        return new
        (
            id: row.id,
            username: row.username,
            email: row.email,
            created_on: row.created_on,
            updated_on: row.updated_on
        );
    }

    public async Task<User> FindUser(string usernameOrEmail, string password)
    {
        var found = await db
            .Query(UserRow.Table)
            .Select("*")
            .Where("users.email", usernameOrEmail)
            .SafeFirstOrDefault<UserRow>()
        ?? await db
            .Query(UserRow.Table)
            .Select("*")
            .Where("users.username", usernameOrEmail)
            .SafeFirstOrDefault<UserRow>()
            ;
        if (found == null || !passwordHasher.Verify(password, found.hashed_password))
        {
            throw new UnauthorisedError("FindUser", "InvalidCredentials");
        }

        return new
        (
            id: found.id,
            username: found.username,
            email: found.email,
            created_on: found.created_on,
            updated_on: found.updated_on
        );
    }
}