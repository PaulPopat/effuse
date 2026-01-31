import { Channel, Role, RolePermission } from "@/domain/server-management";
import React from "react";

export type ServerManagementContext = {
  roles: Array<Role>;
  channels: Array<Channel>;
  create_channel: (name: string, type: "voice" | "message") => Promise<void>;
  create_role: (
    name: string,
    permissions: Array<RolePermission>,
  ) => Promise<void>;
  update_role: (
    id: string,
    name: string,
    permissions: Array<RolePermission>,
  ) => Promise<void>;
};

export const ServerManagementContext = React.createContext<
  ServerManagementContext | undefined
>(undefined);
