import test from "node:test";
import { User } from "./models/User.ts";
import assert from "node:assert";
import { Encode } from "./utils/jwt-client.ts";

test("gets and updates the profile biography", async () => {
  const user = await User.Init();
  const session = await user.authenticate("email");

  assert.deepEqual(await session.getProfile(), {
    username: user.username,
    biography: null,
    iconUrl: null,
  });

  assert.deepEqual(await session.putBiography("This is a biography"), {
    username: user.username,
    biography: "This is a biography",
    iconUrl: null,
  });

  assert.deepEqual(await session.getProfile(), {
    username: user.username,
    biography: "This is a biography",
    iconUrl: null,
  });

  assert.deepEqual(await user.getPublicBiography(), {
    username: user.username,
    biography: "This is a biography",
    iconUrl: null,
  });
});

test("gets and updates servers", async () => {
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

  assert.deepEqual(await session.getServers(), [
    { serverUrl: process.env.SERVER_URL!, serverName: "Test.Com" },
  ]);
});
