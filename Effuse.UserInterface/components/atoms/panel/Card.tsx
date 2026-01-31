import {
  v,
  backdrop,
  margin,
  shadowed,
  center,
  padding,
  gap,
  PaddingAmount,
} from "@/theme";
import React from "react";
import { StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  card: v(backdrop("surface_a10"), shadowed(), gap("large")),
});

export type CardProps = React.PropsWithChildren & {
  direction?: "row" | "column";
  padding?: PaddingAmount;
};

export const Card = (props: CardProps) => {
  return (
    <View
      style={[
        styles.card,
        center(props.direction ?? "column"),
        padding(props.padding ?? "medium"),
      ]}
    >
      {props.children}
    </View>
  );
};
