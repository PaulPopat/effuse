import z from "zod";
import { base_urls, Execute } from "../utils/api-client.ts";
import {
  ServerConnection,
  ServerConnectionTokens,
} from "./ServerConnection.ts";

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

  async connectToServer(serverName: string) {
    const servers = await this.getServers();
    const server = servers.find((s) => s.serverName === serverName);
    if (!server) throw new Error(`Server ${serverName} is not found`);

    if (server.serverUrl !== base_urls.server)
      throw new Error("Only the local server is supported when writing tests");
    const tokensResponse = await Execute({
      url: "/sessions",
      method: "POST",
      body: {
        serverToken: this.#model.serverToken,
      },
      area: "server",
    });

    return new ServerConnection(
      server.serverUrl,
      ServerConnectionTokens.parse(tokensResponse),
    );
  }
}
