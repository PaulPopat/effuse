import React from "react";
import { FormContext } from "./FormContext";
import { IconButton } from "@/components/atoms/button";
import { CirclePlus, Trash2 } from "lucide-react-native";
import { Row, RowFill } from "@/components/atoms/layout";

export type FormArrayToggleProps = {
  onPress: () => void;
};

export type FormArrayProps = React.PropsWithChildren & {
  name: string;
  row_default?: unknown;
};

export const FormArray = (props: FormArrayProps) => {
  const ctx = React.useContext(FormContext);
  if (!ctx) throw new Error("Must be within a form provider");

  const values = ctx.get(props.name) ?? [];
  if (!Array.isArray(values)) return <>Invalid Data Type</>;
  return (
    <>
      {values.map((value, index) => (
        <FormContext.Provider
          key={index}
          value={{
            ...ctx,
            get: (key) => value[key],
            set: (key, v) => {
              const input = [...values];
              input[index] = {
                ...values[index],
                [key]: v,
              };

              return ctx.set(props.name, input);
            },
            validation: (key) =>
              ctx.validation([props.name, index.toString(), key].join(".")),
          }}
        >
          <Row align="top" gap="large">
            <RowFill>{props.children}</RowFill>
            <IconButton
              icon={Trash2}
              colour="light_a0"
              hover="primary_a40"
              press={() =>
                ctx.set(
                  props.name,
                  values.filter((_, i) => i !== index),
                )
              }
            />
          </Row>
        </FormContext.Provider>
      ))}
      <IconButton
        icon={CirclePlus}
        colour="light_a0"
        hover="primary_a40"
        press={() => ctx.set(props.name, [...values, props.row_default ?? {}])}
      />
    </>
  );
};
