import { AuthProvider } from "@/state";
import { Slot } from "expo-router";
import React from "react";
import "react-native-reanimated";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}
