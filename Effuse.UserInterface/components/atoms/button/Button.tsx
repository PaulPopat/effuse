import {
  backdrop,
  content,
  margin,
  padding,
  shadowed,
  t,
  text,
  ThemeColour,
  v,
} from "@/theme";
import React from "react";
import { Text, View } from "react-native";

export type ButtonProps = React.PropsWithChildren & {
  press: () => void;
  colour?: ThemeColour;
};

export const Button = (props: ButtonProps) => {
  return (
    <View
      style={v(
        padding("large", "medium"),
        backdrop(props.colour ?? "highlight"),
        margin("medium", "none"),
        shadowed(),
      )}
    >
      <Text style={t(content(props.colour ?? "highlight"), text("medium"))}>
        {props.children}
      </Text>
    </View>
  );
};
