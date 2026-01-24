import test from "node:test";
import { User } from "./models/User.ts";
import { expect } from "expect";
import crypto from "node:crypto";

test("lists the roles", async () => {
  const user = await User.Init();
  const session = await user.authenticate("email");

  expect(await session.getServers()).toEqual([]);
  const connection = await session.setupBasicAdmin();
  const roles = await connection.listRoles();
  const role = roles.find(
    (r: any) => r.id === "00000000-0000-0000-0000-000000000000",
  );

  expect(roles).toEqual(
    expect.arrayContaining([
      {
        id: "00000000-0000-0000-0000-000000000000",
        name: "ServerAdmin",
        permissions: ["ManageRoles"],
      },
    ]),
  );
});

test("invites a user", async () => {
  const user = await User.Init();
  const session = await user.authenticate("email");
  const connection = await session.setupBasicAdmin();
  const invitation = await connection.createInvite(
    "00000000-0000-0000-0000-000000000000",
  );

  expect(invitation.serverUrl).toBe(process.env.SERVER_URL!);

  const user2 = await User.Init();
  const session2 = await user2.authenticate("email");
  await session2.postServer(
    invitation.serverUrl,
    "Test.Com",
    invitation.inviteToken,
  );

  expect(await session2.getServers()).toEqual([
    { serverUrl: process.env.SERVER_URL!, serverName: "Test.Com" },
  ]);
});

test("creates a role and lists users", async () => {
  const user = await User.Init();
  const session = await user.authenticate("email");
  const connection = await session.setupBasicAdmin();

  const roleName = crypto.randomUUID();
  const role = await connection.createRole(roleName, ["ViewUsers"]);
  expect(role).toEqual({
    id: expect.any(String),
    name: roleName,
    permissions: ["ViewUsers"],
  });

  const invite = await connection.createInvite(role.id);

  const user2 = await User.Init();
  const session2 = await user2.authenticate("email");
  await session2.postServer(invite.serverUrl, "Test.Com", invite.inviteToken);
  const connection2 = await session2.connectToServer("Test.Com");
  await expect(connection2.listRoles()).rejects.toThrow();

  expect(await connection2.listUsers()).toEqual(
    expect.arrayContaining([
      {
        id: user.userId,
        createdOn: expect.any(String),
        role: {
          roleId: "00000000-0000-0000-0000-000000000000",
          roleName: "ServerAdmin",
        },
      },
      {
        id: user2.userId,
        createdOn: expect.any(String),
        role: {
          roleId: role.id,
          roleName: role.name,
        },
      },
    ]),
  );
});
