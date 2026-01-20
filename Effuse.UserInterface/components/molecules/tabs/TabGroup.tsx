import { bordered, center, coloured, padding, v } from "@/theme";
import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type TabGroupProps = React.PropsWithChildren;

export const TabGroup = (props: TabGroupProps) => {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={v(
        { paddingBottom: insets.bottom },
        coloured("highlight"),
        bordered("highlight", "top"),
      )}
    >
      <View
        style={v(padding("small"), center("row"), {
          justifyContent: "space-around",
        })}
      >
        {props.children}
      </View>
    </View>
  );
};
