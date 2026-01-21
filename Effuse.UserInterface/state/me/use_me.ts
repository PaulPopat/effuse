import React from "react";
import { MeContext } from "./MeContext";

export function use_me() {
  const value = React.useContext(MeContext);

  if (!value) throw new Error("Should be within the me state machine");
  return value;
}
