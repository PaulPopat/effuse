import React from "react";
import { ServerManagementContext } from "./ServerManagementContext";
import { use_server_auth } from "../server-auth";
import { use_setup } from "./use_setup";
import { send } from "@/utils/api";
import { ChannelModel } from "./ChannelModel";
import { create_channel } from "./create_channel";
import { RoleModel } from "./RoleModel";
import { Role, RolePermission } from "@/domain/server-management";

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
      create_role: async (name, permissions) => {
        const role = await send({
          path: `/roles`,
          base: session.BaseUrl,
          method: "POST",
          body: {
            name: name,
            permissions: [
              ...permissions.map((p) => ({
                action: p.Action,
                resource: p.Resource,
              })),
            ],
          },
          expect: RoleModel,
          token: session.AccessToken,
        });

        set_roles((r) => [
          ...r,
          new Role({
            id: role.id,
            name: role.name,
            permissions: role.permissions.map(
              (p) =>
                new RolePermission({ action: p.action, resource: p.resource }),
            ),
          }),
        ]);
      },
      update_role: async (id, name, permissions) => {
        await send({
          path: `/roles/${id}`,
          base: session.BaseUrl,
          method: "PUT",
          body: {
            name: name,
            permissions: [
              ...permissions.map((p) => ({
                action: p.Action,
                resource: p.Resource,
              })),
            ],
          },
          expect: RoleModel,
          token: session.AccessToken,
        });

        set_roles((r) =>
          r.map((r) => (r.Id === id ? new Role({ id, name, permissions }) : r)),
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
