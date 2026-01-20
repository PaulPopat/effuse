import { Session } from "@/domain/auth";
import React from "react";

export type AuthContext = {
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  start_register: (email: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
    verification: string,
  ) => Promise<void>;
  session: Session | null;
};

export const AuthContext = React.createContext<AuthContext | undefined>(
  undefined,
);
