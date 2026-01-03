import test from "node:test";
import { User } from "./models/User.ts";
import assert from "node:assert";

test("creates a user and logs in", async () => {
  const user = await User.Init();
  const session = await user.authenticate();
  assert.deepEqual(await session.verify(), {
    userId: user.userId,
  });
});
