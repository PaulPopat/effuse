import { suspended } from "@/utils/suspended";
import { ServerSession, Session } from "@/domain/auth";
import { send } from "@/utils/api";
import { SessionModel } from "./SessionModel";

export const use_setup = suspended(
  async (main_session: Session, base_url: string) => {
    const model = await send({
      base: base_url,
      path: "/sessions",
      method: "POST",
      body: {
        serverToken: main_session.ServerToken.Value,
      },
      expect: SessionModel,
    });

    return new ServerSession({
      access_token: model.accessToken,
      refresh_token: model.refreshToken,
      expires: new Date(model.expires),
      token_type: model.tokenType,
      base_url,
    });
  },
);
