import { Tab, TabGroup } from "@/components/molecules/tabs";
import { coloured, v } from "@/theme";
import { Slot } from "expo-router";
import { Server, User } from "lucide-react-native";
import React from "react";
import { ScrollView, View } from "react-native";

export default function TabLayout() {
  return (
    <View
      style={v(
        { display: "flex", height: "100%", flexDirection: "column" },
        coloured("body"),
      )}
    >
      <View style={{ flex: 1 }}>
        <ScrollView>
          <Slot />
        </ScrollView>
      </View>
      <TabGroup>
        <Tab icon={Server}>Servers</Tab>
        <Tab icon={User}>Profile</Tab>
      </TabGroup>
    </View>
  );
}
