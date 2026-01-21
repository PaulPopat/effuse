import React from "react";
import { StyleSheet, View } from "react-native";

export type RowFillProps = React.PropsWithChildren;

export const RowFill = (props: RowFillProps) => {
  return <View style={styles.row}>{props.children}</View>;
};

const styles = StyleSheet.create({
  row: {
    flex: 1,
  },
});
