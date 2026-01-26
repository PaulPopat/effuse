import { FormValue } from "@/utils/form";
import React from "react";
import z from "zod";

export type FormContext = {
  get: (key: string) => FormValue;
  set: (key: string, value: FormValue) => void;
  validation: (key: string) => Array<z.core.$ZodIssue> | null;
  submit: () => void;
  submitted: boolean;
  loading: boolean;
  error: Error | undefined;
};

export const FormContext = React.createContext<FormContext | undefined>(
  undefined,
);
