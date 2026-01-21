import { content, margin, t, text, ThemeColour, v } from "@/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export type ParagraphProps = React.PropsWithChildren & {
  content: ThemeColour;
};

export const Paragraph = (props: ParagraphProps) => {
  return (
    <Text style={[styles.paragraph, content(props.content)]}>
      {props.children}
    </Text>
  );
};

const styles = StyleSheet.create({
  paragraph: t(text("medium"), { width: "100%" }, margin("medium", "none")),
});
