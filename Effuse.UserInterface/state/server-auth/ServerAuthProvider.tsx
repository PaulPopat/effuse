import { use_auth } from "../auth";
import React from "react";
import { ServerAuthContext } from "./ServerAuthContext";
import { use_setup } from "./use_setup";
import { ServerSession } from "@/domain/auth";
import { send } from "@/utils/api";
import { SessionModel } from "./SessionModel";

export type ServerAuthProviderProps = React.PropsWithChildren & {
  base_url: string;
};

async function refresh_session(session: ServerSession, base_url: string) {
  const model = await send({
    base: base_url,
    path: "/session/refresh",
    method: "POST",
    token: session.RefreshToken,
    expect: SessionModel,
  });

  return new ServerSession({
    access_token: model.accessToken,
    refresh_token: model.refreshToken,
    expires: new Date(model.expires),
    token_type: model.tokenType,
    base_url,
  });
}

export const ServerAuthProvider = (props: ServerAuthProviderProps) => {
  const { session: main_session } = use_auth();
  if (!main_session) return <></>;
  const initial = use_setup(main_session, props.base_url);
  const [session, set_session] = React.useState(initial);

  const ctx: ServerAuthContext = React.useMemo(() => ({ session }), [session]);

  React.useEffect(() => {
    if (!session) return;
    const interval = setInterval(() => {
      if (!session.NeedsRefresh) return;
      clearInterval(interval);
      refresh_session(session, props.base_url).then(set_session);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [session]);

  return (
    <ServerAuthContext.Provider value={ctx}>
      {props.children}
    </ServerAuthContext.Provider>
  );
};
