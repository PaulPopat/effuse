import {
  backdrop,
  center,
  content,
  gap,
  margin,
  padding,
  shadowed,
  t,
  text,
  ThemeColour,
  v,
} from "@/theme";
import { Href, Link } from "expo-router";
import { LucideIcon } from "lucide-react-native";
import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";

export type ButtonProps = React.PropsWithChildren & {
  backdrop: ThemeColour;
  content: ThemeColour;
  small?: boolean;
  loading?: boolean;
  icon?: LucideIcon;
  any_children?: boolean;
} & (
    | {
        press: () => unknown;
      }
    | {
        href: Href;
      }
  );

export const Button = (props: ButtonProps) => {
  const result = (
    <Pressable
      style={v(
        styles.button,
        backdrop(props.backdrop),
        props.small ? styles.button_small : {},
      )}
      onPress={"press" in props ? props.press : undefined}
    >
      {props.loading ? (
        <ActivityIndicator color={ThemeColour[props.content]} />
      ) : props.any_children ? (
        props.children
      ) : (
        <Text style={[styles.button_text, content(props.content)]}>
          {props.children}
        </Text>
      )}
    </Pressable>
  );

  if ("href" in props) {
    return (
      <Link href={props.href} asChild>
        {result}
      </Link>
    );
  }

  return result;
};

const styles = StyleSheet.create({
  button: v(
    padding("medium", "medium"),
    margin("medium", "none"),
    shadowed(),
    center("column"),
    gap("medium"),
  ),
  button_small: v(padding("medium")),
  button_text: t(text("medium")),
});
