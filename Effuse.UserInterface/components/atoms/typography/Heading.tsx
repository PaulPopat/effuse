import { content, margin, t, text, ThemeColour, v } from "@/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export type HeadingProps = React.PropsWithChildren & {
  level: "1" | "2";
  content: ThemeColour;
};

export const Heading = (props: HeadingProps) => {
  return (
    <Text style={[styles.heading, content(props.content), styles[props.level]]}>
      {props.children}
    </Text>
  );
};

const styles = StyleSheet.create({
  heading: t({ width: "100%" }, margin("none", "none", "large")),
  "1": t(text("extra_large")),
  "2": t(text("large")),
});
