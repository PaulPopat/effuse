import React from "react";
import { ServerManagementContext } from "./ServerManagementContext";

export function use_server_management() {
  const value = React.useContext(ServerManagementContext);

  if (!value) throw new Error("Should be within the server management state machine");
  return value;
}
