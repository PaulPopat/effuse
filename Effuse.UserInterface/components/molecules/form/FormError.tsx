import React from "react";
import { FormContext } from "./FormContext";
import { StyleSheet, Text, View } from "react-native";
import {
  backdrop,
  content,
  margin,
  padding,
  shadowed,
  t,
  text,
  v,
} from "@/theme";

export type FormErrorProps = {
  children: React.ReactNode | ((error: Error) => React.ReactNode);
};

export const FormError = (props: FormErrorProps) => {
  const ctx = React.useContext(FormContext);
  if (!ctx) throw new Error("Must be within a form provider");

  if (!ctx.error) return null;

  const children =
    typeof props.children === "function"
      ? props.children(ctx.error)
      : props.children;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: v(
    padding("medium"),
    shadowed(),
    backdrop("danger_a00"),
    margin("medium", "none"),
  ),
  text: t(content("danger_a20"), text("medium")),
});
