import { CurrentProfile, ServerEntry } from "@/domain/me";
import React from "react";

export type MeContext = {
  profile: CurrentProfile;
  servers: Array<ServerEntry>;
  set_biography: (biography: string) => Promise<void>;
  add_server: (server_url: string, server_name: string) => Promise<void>;
};

export const MeContext = React.createContext<MeContext | undefined>(undefined);
