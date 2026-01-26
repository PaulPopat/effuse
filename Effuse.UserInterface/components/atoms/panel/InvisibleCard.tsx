import { v, margin, center, padding, gap, PaddingAmount } from "@/theme";
import React from "react";
import { StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  card: v(margin("medium"), gap("large")),
});

export type InvisibleCardProps = React.PropsWithChildren & {
  direction?: "row" | "column";
  padding?: PaddingAmount;
};

export const InvisibleCard = (props: InvisibleCardProps) => {
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
