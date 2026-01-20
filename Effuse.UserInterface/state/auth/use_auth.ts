import React from "react";
import { AuthContext } from "./AuthContext";

export function use_auth() {
  const value = React.useContext(AuthContext);

  if (!value) throw new Error("Should be within the auth state machine");
  return value;
}
