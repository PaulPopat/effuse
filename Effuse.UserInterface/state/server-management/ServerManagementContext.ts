import { Channel, Role } from "@/domain/server-management";
import React from "react";

export type ServerManagementContext = {
  roles: Array<Role>;
  channels: Array<Channel>;
  create_channel: (name: string, type: "voice" | "message") => Promise<void>;
  add_permission: (
    role: Role,
    action: string,
    resource: string,
  ) => Promise<void>;
};

export const ServerManagementContext = React.createContext<
  ServerManagementContext | undefined
>(undefined);
