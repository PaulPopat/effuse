import { ServerSession } from "@/domain/auth";
import React from "react";

export type ServerAuthContext = {
  session: ServerSession;
};

export const ServerAuthContext = React.createContext<
  ServerAuthContext | undefined
>(undefined);
