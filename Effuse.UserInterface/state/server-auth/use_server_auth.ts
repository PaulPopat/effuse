import React from "react";
import { ServerAuthContext } from "./ServerAuthContext";

export function use_server_auth() {
  const value = React.useContext(ServerAuthContext);

  if (!value) throw new Error("Should be within the server auth state machine");
  return value;
}
