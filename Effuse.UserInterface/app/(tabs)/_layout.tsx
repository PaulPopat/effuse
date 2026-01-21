import { MeProvider } from "@/state";
import { Slot } from "expo-router";
import React from "react";

export default function TabLayout() {
  return (
    <MeProvider>
      <Slot />
    </MeProvider>
  );
}
