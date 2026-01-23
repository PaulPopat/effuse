using Effuse.Core.Errors;
using Effuse.Core.Integrations;
using Effuse.Server.Domain;
using Effuse.Server.Integrations.Tables;
using SqlKata.Execution;

namespace Effuse.Server.Integrations;

public class UserRepository
(
  QueryFactory db,
  DateTimeService dateTimeService,
  IRoleRepository roleRepository
) : IUserRepository
{
  public async Task<User> CreateUser(Guid userId, Role role)
  {
    var existing = await db.Query(UserRow.TableName).Select("*").Where("id", userId).GetAsync<UserRow>();
    if (existing.Any())
    {
      throw new ConflictError("CreateUser", "Id");
    }


    var now = dateTimeService.Now;
    await db.Query(UserRow.TableName).InsertAsync(new UserRow
    {
      id = userId,
      created_on = now,
      role = role.Id,
    });

    return new
    (
      id: userId,
      created_on: now,
      role: role
    );
  }

  public async Task<User> GetUser(Guid userId)
  {
    var found = await db.Query(UserRow.TableName).Select("*").Where("id", userId).FirstOrDefaultAsync<UserRow>();
    if (found == null)
    {
      throw new NotFoundError("GetUser", userId.ToString());
    }

    return new
    (
      id: found.id,
      created_on: found.created_on,
      role: await roleRepository.GetRole(found.role)
    );
  }

  public async IAsyncEnumerable<User> ListUsers()
  {
    var entries = await db.Query(UserRow.TableName).Select("*").GetAsync<UserRow>();
    foreach (var found in entries)
    {
      yield return new
      (
        id: found.id,
        created_on: found.created_on,
        role: await roleRepository.GetRole(found.role)
      );
    }
  }

  public async Task<User> UpdateUser(User user)
  {
    var existing = await db.Query(UserRow.TableName).Select("*").Where("id", user.Id).FirstOrDefaultAsync<UserRow>();
    if (existing == null)
    {
      throw new NotFoundError("CreateUser", user.Id.ToString());
    }


    var now = dateTimeService.Now;
    await db.Query(UserRow.TableName).Where("id", user.Id).UpdateAsync(new UserRow
    {
      id = existing.id,
      created_on = existing.created_on,
      role = user.Role.Id,
    });

    return new
    (
      id: existing.id,
      created_on: existing.created_on,
      role: user.Role
    );
  }
}