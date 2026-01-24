import z from "zod";
import { Execute } from "../utils/api-client.ts";

export const ServerConnectionTokens = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expires: z.coerce.date(),
  tokenType: z.string(),
});

export type ServerConnectionTokens = z.infer<typeof ServerConnectionTokens>;

export class ServerConnection {
  readonly #url: string;
  readonly #tokens: ServerConnectionTokens;

  constructor(url: string, tokens: ServerConnectionTokens) {
    this.#url = url;
    this.#tokens = tokens;
  }

  async listRoles() {
    return await Execute({
      url: "/roles",
      method: "GET",
      headers: {
        Authorization: [this.#tokens.tokenType, this.#tokens.accessToken].join(
          " ",
        ),
      },
      area: "server",
    });
  }

  async listUsers() {
    return await Execute({
      url: "/users",
      method: "GET",
      headers: {
        Authorization: [this.#tokens.tokenType, this.#tokens.accessToken].join(
          " ",
        ),
      },
      area: "server",
    });
  }

  async createRole(
    name: string,
    permissions: Array<{ area: string; modification: string }>,
  ) {
    return z
      .object({
        id: z.string(),
        name: z.string(),
        permissions: z.array(
          z.object({ area: z.string(), modification: z.string() }),
        ),
      })
      .parse(
        await Execute({
          url: "/roles",
          method: "POST",
          headers: {
            Authorization: [
              this.#tokens.tokenType,
              this.#tokens.accessToken,
            ].join(" "),
          },
          body: { name, permissions },
          area: "server",
        }),
      );
  }

  async createInvite(roleId: string) {
    return z
      .object({
        inviteToken: z.string(),
        serverUrl: z.string(),
      })
      .parse(
        await Execute({
          url: "/invitations",
          method: "POST",
          headers: {
            Authorization: [
              this.#tokens.tokenType,
              this.#tokens.accessToken,
            ].join(" "),
          },
          body: { roleId },
          area: "server",
        }),
      );
  }
}
