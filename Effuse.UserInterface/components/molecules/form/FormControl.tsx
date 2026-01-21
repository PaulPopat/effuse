import React from "react";
import { FormContext } from "./FormContext";
import { StyleSheet, Text, View } from "react-native";
import { content, gap, margin, shadowed, t, text, v } from "@/theme";
import { FormValue } from "@/utils/form";

export type FormControlFieldProps = {
  value: FormValue;
  change: (value: FormValue) => void;
  children: never;
  invalid?: boolean;
  blur?: () => void;
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
  const [should_validate, set_should_validate] = React.useState(false);
  const show_errors = ctx.submitted || should_validate;

  const validation = ctx
    .validation(props.name)
    ?.filter((v) => v.path.join(".") === props.name);
  const invalid = show_errors && !!validation?.length;

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
        blur={() => set_should_validate(true)}
      />
      {show_errors &&
        validation?.map((v) => (
          <Text style={styles.error_text}>{v.message}</Text>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: v(
    gap("medium"),
    {
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "flex-start",
    },
    margin("medium", "none"),
    shadowed(),
  ),
  title: t(text("medium"), content("light_a0")),
  container_error: v(),
  title_error: t(content("danger_a20")),
  error_text: t(
    content("danger_a20"),
    text("small"),
    { width: "100%" },
    margin("small", "none"),
  ),
});
