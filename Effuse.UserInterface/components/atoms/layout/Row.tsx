import { gap } from "@/theme";
import React from "react";
import { StyleSheet, View } from "react-native";

export type RowProps = React.PropsWithChildren & {
  align?: "centre" | "top" | "bottom";
  gap?: "small" | "medium" | "large" | "none";
};

const alignments = Object.freeze({
  top: "flex-start",
  centre: "center",
  bottom: "flex-end",
});

export const Row = (props: RowProps) => {
  return (
    <View
      style={[
        styles.row,
        { alignItems: alignments[props.align ?? "centre"] },
        gap(props.gap ?? "none"),
      ]}
    >
      {props.children}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "100%",
  },
});
