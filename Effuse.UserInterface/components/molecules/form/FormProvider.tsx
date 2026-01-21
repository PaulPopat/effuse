import React from "react";
import z from "zod";
import { FormContext } from "./FormContext";
import { FormValue } from "@/utils/form";

export type FormProviderProps<T extends Record<string, FormValue>> =
  React.PropsWithChildren & {
    schema: z.ZodType<T>;
    submit: (value: T) => Promise<any>;
  };

export const FormProvider = <T extends Record<string, FormValue>>(
  props: FormProviderProps<T>,
) => {
  const [value, set_value] = React.useState<Record<string, FormValue>>({});
  const [submitted, set_submited] = React.useState(false);
  const [loading, set_loading] = React.useState(false);

  const validation = React.useMemo(
    () => props.schema.safeParse(value),
    [props.schema, value],
  );

  const ctx = React.useMemo(
    (): FormContext => ({
      get: (key) => value[key],
      set: (key, v) => set_value({ ...value, [key]: v }),
      validation: (key) =>
        validation.error?.issues?.filter((i) => i.path.join(".") === key) ??
        null,
      submit: async () => {
        try {
          set_loading(true);
          set_submited(true);
          if (!validation.success) return;
          await props.submit(validation.data);
        } finally {
          set_loading(false);
        }
      },
      submitted,
      loading,
    }),
    [
      value,
      set_value,
      validation,
      props.submit,
      submitted,
      loading,
      set_loading,
    ],
  );

  return (
    <FormContext.Provider value={ctx}>{props.children}</FormContext.Provider>
  );
};
