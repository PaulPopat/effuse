import React from "react";
import { ServerManagementContext } from "./ServerManagementContext";
import { use_server_auth } from "../server-auth";
import { use_setup } from "./use_setup";
import { send } from "@/utils/api";
import { ChannelModel } from "./ChannelModel";
import { create_channel } from "./create_channel";
import { RoleModel } from "./RoleModel";
import { RolePermission } from "@/domain/server-management";

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
      add_permission: async (role, action, resource) => {
        await send({
          path: `/roles/${role.Id}`,
          base: session.BaseUrl,
          method: "PUT",
          body: {
            name: role.Name,
            permissions: [
              ...role.Permissions.map((p) => ({
                action: p.Action,
                resource: p.Resource,
              })),
              { action, resource },
            ],
          },
          expect: RoleModel,
          token: session.AccessToken,
        });

        set_roles((r) =>
          r.map((r) =>
            r.Id === role.Id
              ? role.WithPermission(new RolePermission({ action, resource }))
              : role,
          ),
        );
      },
    }),
    [roles, channels, set_channels, set_roles],
  );

  return (
    <ServerManagementContext.Provider value={ctx}>
      {props.children}
    </ServerManagementContext.Provider>
  );
};
