import { bordered, margin, ThemeColour, v } from "@/theme";
import React from "react";
import { StyleSheet, View } from "react-native";

export type DividerProps = { colour: ThemeColour; spaced?: boolean };

export const Divider = (props: DividerProps) => {
  return (
    <View
      style={v(
        bordered(props.colour, "bottom"),
        styles.divider,
        props.spaced ? margin("large", "none") : {},
      )}
    />
  );
};

const styles = StyleSheet.create({
  divider: {
    width: "100%",
  },
});
