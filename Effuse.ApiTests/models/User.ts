import { Execute } from "../utils/api-client.ts";
import { JSDOM } from "jsdom";
import z from "zod";
import assert from "node:assert";
import { Session, SessionModel } from "./Session.ts";

export const UserModel = z.object({
  id: z.uuidv4(),
  username: z.string(),
  email: z.email(),
  createdOn: z.coerce.date(),
  updatedOn: z.coerce.date(),
});

export type UserModel = z.infer<typeof UserModel>;

export class User {
  static async Init() {
    const user_email = `${crypto.randomUUID()}@test.com`;
    const user_username = crypto.randomUUID();
    const user_password = crypto.randomUUID();

    await Execute({
      url: "/user-staging",
      method: "POST",
      body: { email: user_email },
    });

    const [mail] = await Execute({
      url: "/email",
      method: "GET",
      query: { "headers.to": user_email },
      area: "maildev",
    });

    const dom = new JSDOM(mail.html);
    const url = dom.window.document
      .querySelector("#verify-email")
      ?.getAttribute("href");
    if (!url) throw new Error("Invalid email html");
    const user_url = new URL(url);
    const token = user_url.searchParams.get("token");

    const user_response = await Execute({
      url: "/users",
      method: "POST",
      body: {
        username: user_username,
        email: user_email,
        password: user_password,
        verification: token,
      },
    });

    assert.partialDeepStrictEqual(user_response, {
      username: user_username,
      email: user_email,
    });

    return new User(UserModel.parse(user_response), user_password);
  }

  readonly #model: UserModel;
  readonly #password: string;

  private constructor(model: UserModel, password: string) {
    this.#model = model;
    this.#password = password;
  }

  get userId() {
    return this.#model.id;
  }

  async authenticate(mode: "username" | "email" = "email") {
    const response = await Execute({
      url: "/sessions",
      method: "POST",
      body: {
        usernameOrEmail:
          mode === "email" ? this.#model.email : this.#model.username,
        password: this.#password,
      },
    });

    return new Session(SessionModel.parse(response));
  }
}
