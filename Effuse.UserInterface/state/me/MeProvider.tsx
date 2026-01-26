import { suspended } from "@/utils/suspended";
import { use_auth } from "../auth";
import { Session } from "@/domain/auth";
import { send } from "@/utils/api";
import { AUTH_BASE_URL } from "@/utils/env";
import z from "zod";
import { ServerEntry } from "@/domain/me";
import { CurrentProfile } from "@/domain/me/CurrentProfile";
import React from "react";
import { MeContext } from "./MeContext";
import { useRouter } from "expo-router";

const ServerModel = z.object({
  id: z.string(),
  serverUrl: z.string(),
  serverName: z.string(),
});

const ServersModel = z.array(ServerModel);

const ProfileModel = z.object({
  username: z.string(),
  biography: z.string().optional().nullable(),
  iconUrl: z.string().optional().nullable(),
});

const use_setup = suspended(async (session: Session) => {
  const servers = await send({
    path: "/me/servers",
    base: AUTH_BASE_URL,
    method: "GET",
    token: session.AccessToken,
    expect: ServersModel,
  });

  const profile = await send({
    path: "/me/profile",
    base: AUTH_BASE_URL,
    method: "GET",
    token: session.AccessToken,
    expect: ProfileModel,
  });

  return {
    servers: servers.map(
      (s) =>
        new ServerEntry({
          id: s.id,
          server_url: s.serverUrl,
          server_name: s.serverName,
        }),
    ),
    profile: new CurrentProfile({
      username: profile.username,
      biography: profile.biography ?? null,
      icon_url: profile.iconUrl ?? null,
    }),
  };
});

export const MeProvider = (props: React.PropsWithChildren) => {
  const { session } = use_auth();
  if (!session) return <></>;
  const initial = use_setup(session);

  const [servers, set_servers] = React.useState(initial.servers);
  const [profile, set_profile] = React.useState(initial.profile);
  const router = useRouter();

  const ctx: MeContext = React.useMemo(
    () => ({
      servers,
      profile,
      set_biography: async (biography) => {
        const profile = await send({
          path: "/me/profile/biography",
          base: AUTH_BASE_URL,
          method: "PUT",
          token: session.AccessToken,
          body: { biography },
          expect: ProfileModel,
        });

        set_profile(
          new CurrentProfile({
            username: profile.username,
            biography: profile.biography ?? null,
            icon_url: profile.iconUrl ?? null,
          }),
        );
      },
      add_server: async (server_url, server_name, invite_token) => {
        const server = await send({
          path: "/me/servers",
          base: AUTH_BASE_URL,
          method: "POST",
          token: session.AccessToken,
          body: {
            serverUrl: server_url,
            serverName: server_name,
            inviteToken: invite_token,
          },
          expect: ServerModel,
        });

        set_servers([
          ...servers,
          new ServerEntry({ id: server.id, server_name, server_url }),
        ]);

        router.push("/servers");
      },
    }),
    [servers, set_servers, profile, set_profile, session],
  );

  return <MeContext.Provider value={ctx}>{props.children}</MeContext.Provider>;
};
