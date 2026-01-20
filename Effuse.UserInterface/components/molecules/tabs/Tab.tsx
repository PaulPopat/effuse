import {
  center,
  coloured,
  font_sizes,
  foreground,
  gap,
  padding,
  t,
  text,
  v,
} from "@/theme";
import React from "react";
import { Text, View } from "react-native";
import { LucideIcon } from "lucide-react-native";

export type TabProps = React.PropsWithChildren & {
  icon: LucideIcon;
};

export const Tab = (props: TabProps) => {
  return (
    <View style={v(padding("medium"), center("column"), gap("small"))}>
      <props.icon color={foreground.highlight} size={font_sizes.large} />
      <Text style={t(text("extra_small"), coloured("highlight"))}>
        {props.children}
      </Text>
    </View>
  );
};
