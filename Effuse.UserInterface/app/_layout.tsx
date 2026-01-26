import { AuthProvider } from "@/state";
import { backdrop, v } from "@/theme";
import { Slot } from "expo-router";
import React from "react";
import { View } from "react-native";
import { useFonts } from "expo-font";
import "react-native-reanimated";

export default function RootLayout() {
  useFonts({
    Montserrat: require("../assets/fonts/Montserrat.ttf"),
  });

  return (
    <View style={v({ height: "100%" }, backdrop("surface_a00"))}>
      <AuthProvider>
        <Slot />
      </AuthProvider>
    </View>
  );
}
