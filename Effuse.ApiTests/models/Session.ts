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
        Authorization: [this.#model.tokenType, this.#model.accessToken].join(
          " "
        ),
      },
    });
    return z.object({ userId: z.string() }).parse(response);
  }
}
