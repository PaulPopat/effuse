import { backdrop, v } from "@/theme";
import { Slot } from "expo-router";
import React from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AuthLayout() {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={v({
        display: "flex",
        height: "100%",
        flexDirection: "column",
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      })}
    >
      <ScrollView>
        <Slot />
      </ScrollView>
    </View>
  );
}
