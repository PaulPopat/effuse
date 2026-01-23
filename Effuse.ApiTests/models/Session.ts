import z from "zod";
import { Execute } from "../utils/api-client.ts";

export const SessionModel = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  serverToken: z.string(),
  expires: z.coerce.date(),
  tokenType: z.string(),
});

export type SessionModel = z.infer<typeof SessionModel>;

export class Session {
  readonly #model: SessionModel;

  constructor(model: SessionModel) {
    this.#model = model;
  }

  async verify() {
    const response = await Execute({
      url: "/sessions/current",
      method: "GET",
      headers: {
        Authorization: [this.#model.tokenType, this.#model.serverToken].join(
          " ",
        ),
      },
    });

    return z.object({ userId: z.string() }).parse(response);
  }

  async refresh() {
    const response = await Execute({
      url: "/sessions/refresh",
      method: "GET",
      headers: {
        Authorization: [this.#model.tokenType, this.#model.refreshToken].join(
          " ",
        ),
      },
    });

    return new Session(SessionModel.parse(response));
  }

  async getProfile() {
    const response = await Execute({
      url: "/me/profile",
      method: "GET",
      headers: {
        Authorization: [this.#model.tokenType, this.#model.accessToken].join(
          " ",
        ),
      },
    });

    return z
      .object({
        username: z.string(),
        biography: z.string().nullable(),
        iconUrl: z.string().nullable(),
      })
      .parse(response);
  }

  async putBiography(biography: string) {
    const response = await Execute({
      url: "/me/profile/biography",
      method: "PUT",
      headers: {
        Authorization: [this.#model.tokenType, this.#model.accessToken].join(
          " ",
        ),
      },
      body: { biography },
    });

    return z
      .object({
        username: z.string(),
        biography: z.string().nullable(),
        iconUrl: z.string().nullable(),
      })
      .parse(response);
  }

  async getServers() {
    const response = await Execute({
      url: "/me/servers",
      method: "GET",
      headers: {
        Authorization: [this.#model.tokenType, this.#model.accessToken].join(
          " ",
        ),
      },
    });

    return z
      .array(
        z.object({
          serverUrl: z.string(),
          serverName: z.string(),
        }),
      )
      .parse(response);
  }

  async postServer(serverUrl: string, serverName: string, inviteToken: string) {
    await Execute({
      url: "/me/servers",
      method: "POST",
      headers: {
        Authorization: [this.#model.tokenType, this.#model.accessToken].join(
          " ",
        ),
      },
      body: { serverUrl, serverName, inviteToken },
    });
  }
}
