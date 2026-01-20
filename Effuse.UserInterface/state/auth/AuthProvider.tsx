import { suspended } from "@/utils/suspended";
import * as Store from "@/utils/secure-store";
import React from "react";
import { SessionModel } from "./SessionModel";
import { Session } from "../../domain/auth";
import { AUTH_BASE_URL } from "@/utils/env";
import { send } from "@/utils/api";
import { AuthContext } from "./AuthContext";

const key = "auth_info";

async function refresh_session(session: Session) {
  try {
    const result = await send({
      base: AUTH_BASE_URL,
      path: "/session/refresh",
      method: "POST",
      token: session.RefreshToken,
    });

    const model = SessionModel.parse(result);

    return new Session({
      access_token: model.accessToken,
      refresh_token: model.refreshToken,
      server_token: model.serverToken,
      expires: new Date(model.expires),
      token_type: model.tokenType,
    });
  } catch (err) {
    console.error(err);
    return null;
  }
}

const use_default = suspended(async () => {
  try {
    const result = await Store.getItemAsync(key);

    if (!result) return null;

    const model = SessionModel.parse(JSON.parse(result));
    const session = new Session({
      access_token: model.accessToken,
      refresh_token: model.refreshToken,
      server_token: model.serverToken,
      expires: new Date(model.expires),
      token_type: model.tokenType,
    });

    if (session.NeedsRefresh) return await refresh_session(session);

    return session;
  } catch (err) {
    console.error(err);
    return null;
  }
});

export const AuthProvider = (props: React.PropsWithChildren) => {
  const [session, set_session] = React.useState(use_default());

  React.useEffect(() => {
    void Store.setItemAsync(
      key,
      JSON.stringify(
        session
          ? {
              accessToken: session?.Props.access_token,
              refreshToken: session?.Props.refresh_token,
              serverToken: session?.Props.server_token,
              expires: session?.Props.expires.toISOString(),
              tokenType: session?.Props.token_type,
            }
          : null,
      ),
    );
  }, [session]);

  React.useEffect(() => {
    if (!session) return;
    const interval = setInterval(() => {
      if (!session.NeedsRefresh) return;
      clearInterval(interval);
      refresh_session(session).then(set_session);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [session]);

  const ctx = React.useMemo(
    (): AuthContext => ({
      login: async (username, password) => {
        const result = await send({
          base: AUTH_BASE_URL,
          path: "/session",
          method: "POST",
          body: {
            usernameOrEmail: username,
            password,
          },
        });

        const model = SessionModel.parse(JSON.parse(result));
        set_session(
          new Session({
            access_token: model.accessToken,
            refresh_token: model.refreshToken,
            server_token: model.serverToken,
            expires: new Date(model.expires),
            token_type: model.tokenType,
          }),
        );
      },
      logout: () => {
        set_session(null);
      },
      start_register: async (email) => {
        await send({
          base: AUTH_BASE_URL,
          path: "/user-staging",
          method: "POST",
          body: { email },
        });
      },
      register: async (username, email, password, verification) => {
        await send({
          base: AUTH_BASE_URL,
          path: "/users",
          method: "POST",
          body: { username, email, password, verification },
        });
      },
      session,
    }),
    [set_session, session],
  );

  return (
    <AuthContext.Provider value={ctx}>{props.children}</AuthContext.Provider>
  );
};
