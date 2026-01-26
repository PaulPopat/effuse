import z from "zod";

export const SessionModel = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expires: z.string(),
  tokenType: z.string(),
});

export type SessionModel = z.infer<typeof SessionModel>;
