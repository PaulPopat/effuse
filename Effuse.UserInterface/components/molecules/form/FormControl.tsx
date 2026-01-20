import React from "react";
import { FormContext } from "./FormContext";
import { StyleSheet, Text, View } from "react-native";
import {
  backdrop,
  content,
  gap,
  margin,
  padding,
  shadowed,
  t,
  text,
  v,
} from "@/theme";
import { FormValue } from "@/utils/form";

export type FormControlFieldProps = {
  value: FormValue;
  change: (value: FormValue) => void;
  children: never;
  invalid?: boolean;
};

export type FormControlProps<T extends FormControlFieldProps> =
  React.PropsWithChildren & {
    name: string;
    as: React.ComponentType<T>;
  } & Omit<T, keyof FormControlFieldProps>;

export const FormControl = <T extends FormControlFieldProps>(
  props: FormControlProps<T>,
) => {
  const ctx = React.useContext(FormContext);
  if (!ctx) throw new Error("Must be within a form provider");

  const invalid = ctx.submitted && !!ctx.validation(props.name);

  return (
    <View style={[styles.container, invalid ? styles.container_error : null]}>
      <Text style={[styles.title, invalid ? styles.title_error : null]}>
        {props.children}
      </Text>
      <props.as
        {...(props as any)}
        value={ctx.get(props.name)}
        change={(v) => ctx.set(props.name, v)}
        invalid={invalid}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: v(
    gap("medium"),
    backdrop("highlight"),
    {
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "flex-start",
    },
    padding("medium"),
    margin("medium", "none"),
    shadowed(),
  ),
  title: t(text("medium"), content("highlight")),
  container_error: v(backdrop("error")),
  title_error: t(content("error")),
});
