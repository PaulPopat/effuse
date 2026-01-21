import { backdrop, v } from "@/theme";
import { Slot } from "expo-router";
import React from "react";
import { ScrollView, View } from "react-native";

export default function TabLayout() {
  return (
    <View
      style={v(
        { display: "flex", height: "100%", flexDirection: "column" },
        backdrop("surface_a00"),
      )}
    >
      <View style={{ flex: 1 }}>
        <ScrollView>
          <Slot />
        </ScrollView>
      </View>
    </View>
  );
}
