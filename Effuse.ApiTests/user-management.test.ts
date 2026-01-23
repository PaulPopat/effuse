import test from "node:test";
import { User } from "./models/User.ts";
import assert from "node:assert";
import { Encode } from "./utils/jwt-client.ts";

test("lists the roles", async () => {
  const user = await User.Init();
  const session = await user.authenticate("email");

  assert.deepEqual(await session.getServers(), []);

  await session.postServer(
    process.env.SERVER_URL!,
    "Test.Com",
    await Encode({
      sub: "00000000-0000-0000-0000-000000000000",
      Grant: "Invite",
      RoleId: "00000000-0000-0000-0000-000000000000",
    }),
  );

  const connection = await session.connectToServer("Test.Com");
  const roles = await connection.listRoles();
  const role = roles.find(
    (r: any) => r.id === "00000000-0000-0000-0000-000000000000",
  );
  assert.deepEqual(role, {
    id: "00000000-0000-0000-0000-000000000000",
    name: "ServerAdmin",
    permissions: ["ManageRoles"],
  });
});

test("invites a user", async () => {
  const user = await User.Init();
  const session = await user.authenticate("email");

  await session.postServer(
    process.env.SERVER_URL!,
    "Test.Com",
    await Encode({
      sub: "00000000-0000-0000-0000-000000000000",
      Grant: "Invite",
      RoleId: "00000000-0000-0000-0000-000000000000",
    }),
  );

  const connection = await session.connectToServer("Test.Com");
  const invitation = await connection.createInvite(
    "00000000-0000-0000-0000-000000000000",
  );

  assert.equal(invitation.serverUrl, process.env.SERVER_URL!);

  const user2 = await User.Init();
  const session2 = await user2.authenticate("email");
  await session2.postServer(
    invitation.serverUrl,
    "Test.Com",
    invitation.inviteToken,
  );

  assert.deepEqual(await session2.getServers(), [
    { serverUrl: process.env.SERVER_URL!, serverName: "Test.Com" },
  ]);
});
