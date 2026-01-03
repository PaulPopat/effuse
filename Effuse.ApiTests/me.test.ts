import test from "node:test";
import { User } from "./models/User.ts";
import assert from "node:assert";

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

  await session.postServer("https://www.test.com/", "Test.Com");
  assert.deepEqual(await session.getServers(), [
    { serverUrl: "https://www.test.com/", serverName: "Test.Com" },
  ]);
});
