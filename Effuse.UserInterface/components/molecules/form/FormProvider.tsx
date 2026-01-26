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
  const [status, set_status] = React.useState({
    submitted: false,
    loading: false,
    error: undefined as Error | undefined,
  });

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
          set_status({ loading: true, submitted: true, error: undefined });
          if (!validation.success) {
            return set_status({
              loading: false,
              submitted: true,
              error: undefined,
            });
          }

          await props.submit(validation.data);
          set_status({ loading: false, submitted: true, error: undefined });
        } catch (err) {
          console.error(err);
          set_status({ loading: false, submitted: true, error: err as Error });
        }
      },
      submitted: status.submitted,
      loading: status.loading,
      error: status.error,
    }),
    [value, set_value, validation, props.submit, status, set_status],
  );

  return (
    <FormContext.Provider value={ctx}>{props.children}</FormContext.Provider>
  );
};
