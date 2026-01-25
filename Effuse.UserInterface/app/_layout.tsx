import { AuthProvider } from "@/state";
import { backdrop, v } from "@/theme";
import { Slot } from "expo-router";
import React from "react";
import { View } from "react-native";
import "react-native-reanimated";

export default function RootLayout() {
  return (
    <View style={v({ height: "100%" }, backdrop("surface_a00"))}>
      <AuthProvider>
        <Slot />
      </AuthProvider>
    </View>
  );
}
