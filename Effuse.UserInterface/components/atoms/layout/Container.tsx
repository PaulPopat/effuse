import { backdrop, gap, padding, v } from "@/theme";
import React from "react";
import { StyleSheet, View } from "react-native";

export type ContainerProps = React.PropsWithChildren & {
  full_height?: boolean;
};

export const Container = (props: ContainerProps) => {
  return (
    <View
      style={[
        styles.container,
        props.full_height ? styles.container_full : null,
      ]}
    >
      {props.children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: v(
    padding("medium"),
    backdrop("surface_a00"),
    {
      maxWidth: 750,
      margin: "auto",
      width: "100%",
    },
    gap("large"),
  ),
  container_full: { height: "100%" },
});
