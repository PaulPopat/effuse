import {
  backdrop,
  center,
  content,
  margin,
  padding,
  shadowed,
  t,
  text,
  ThemeColour,
  v,
} from "@/theme";
import { LucideIcon } from "lucide-react-native";
import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";

export type ButtonProps = React.PropsWithChildren & {
  press: () => void;
  backdrop: ThemeColour;
  content: ThemeColour;
  small?: boolean;
  loading?: boolean;
  icon?: LucideIcon;
};

export const Button = (props: ButtonProps) => {
  return (
    <Pressable
      style={[
        styles.button,
        backdrop(props.backdrop),
        props.small ? styles.button_small : null,
      ]}
      onPress={props.press}
    >
      {props.loading ? (
        <ActivityIndicator color={ThemeColour[props.content]} />
      ) : (
        <Text style={[styles.button_text, content(props.content)]}>
          {props.children}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: v(
    padding("large", "medium"),
    margin("medium", "none"),
    shadowed(),
    center("row"),
  ),
  button_small: v(padding("medium")),
  button_text: t(text("medium")),
});
