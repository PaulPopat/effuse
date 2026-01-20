import { AuthProvider, use_auth } from "@/state";
import { Stack } from "expo-router";
import React from "react";
import "react-native-reanimated";

function InnerLayout() {
  const auth = use_auth();

  return (
    <Stack>
      <Stack.Protected guard={!!auth.session}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Screen
        name="auth"
        options={{ presentation: "modal", headerShown: false }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <InnerLayout />
    </AuthProvider>
  );
}
