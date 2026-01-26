import React from "react";
import { ServerManagementContext } from "./ServerManagementContext";
import { use_server_auth } from "../server-auth";
import { use_setup } from "./use_setup";
import { send } from "@/utils/api";
import { ChannelModel } from "./ChannelModel";
import { create_channel } from "./create_channel";

export type ServerManagementProviderProps = React.PropsWithChildren & {
  base_url: string;
};

export const ServerManagementProvider = (props: React.PropsWithChildren) => {
  const { session } = use_server_auth();
  if (!session) return <></>;
  const initial = use_setup(session);
  const [roles, set_roles] = React.useState(initial.roles);
  const [channels, set_channels] = React.useState(initial.channels);

  const ctx: ServerManagementContext = React.useMemo(
    () => ({
      roles,
      channels,
      create_channel: async (name, type) => {
        const result = await send({
          path: `/channels/${type}`,
          base: session.BaseUrl,
          method: "POST",
          body: { name },
          expect: ChannelModel,
          token: session.AccessToken,
        });

        set_channels([...channels, create_channel(result)]);
      },
    }),
    [roles, channels, set_channels],
  );

  return (
    <ServerManagementContext.Provider value={ctx}>
      {props.children}
    </ServerManagementContext.Provider>
  );
};
