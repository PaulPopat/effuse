import test from "node:test";
import { User } from "./models/User.ts";
import assert from "node:assert";

test("creates a user and logs in", async () => {
  const user = await User.Init();
  const session = await user.authenticate("email");
  assert.deepEqual(await session.verify(), {
    userId: user.userId,
  });
});

test("logs in with username", async () => {
  const user = await User.Init();
  const session = await user.authenticate("username");
  assert.deepEqual(await session.verify(), {
    userId: user.userId,
  });
});

test("refreshes a session", async () => {
  const user = await User.Init();
  const session = await user.authenticate();
  assert.deepEqual(await session.verify(), {
    userId: user.userId,
  });

  const second = await session.refresh();
  assert.deepEqual(await second.verify(), {
    userId: user.userId,
  });
});
