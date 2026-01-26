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

export type FormErrorProps = React.PropsWithChildren;

export const FormError = (props: FormErrorProps) => {
  const ctx = React.useContext(FormContext);
  if (!ctx) throw new Error("Must be within a form provider");

  if (!ctx.did_error) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{props.children}</Text>
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
