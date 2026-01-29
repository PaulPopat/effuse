import { Image } from "@/components/atoms/image";
import { MeProvider, use_auth, use_me } from "@/state";
import { Redirect, Slot, useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { PlusCircle, Server } from "lucide-react-native";
import {
  backdrop,
  center,
  content,
  gap,
  padding,
  shadowed,
  t,
  text,
  ThemeColour,
  v,
} from "@/theme";
import { Button, IconButton } from "@/components/atoms/button";
import { Card } from "@/components/atoms/panel";

const styles = StyleSheet.create({
  outer_container: {
    display: "flex",
    flexDirection: "row",
    height: "100%",
  },
  servers_scroller: { flex: 1 },
  server_button: v(center("column"), gap("medium")),
  server_icon: v(padding("medium"), backdrop("primary_a10"), shadowed(), {
    overflow: "hidden",
  }),
  server_text: t(content("light_a0"), text("small")),
  content_container: { flex: 1, height: "100%" },
});

function LayoutInner() {
  const me = use_me();
  const router = useRouter();

  return (
    <View style={styles.outer_container}>
      <Card>
        <ScrollView style={styles.servers_scroller}>
          {me.servers.map((s) => (
            <Pressable
              key={s.Id}
              style={styles.server_button}
              onPress={() => router.push(`/servers/${s.Id}`)}
            >
              <View style={styles.server_icon}>
                <Image href={new URL("/_/icon", s.Url)} width={20} height={20}>
                  <Server
                    width={20}
                    height={20}
                    stroke={ThemeColour.light_a0}
                  />
                </Image>
              </View>
              <Text style={styles.server_text}>{s.Name.substring(0, 15)}</Text>
            </Pressable>
          ))}
        </ScrollView>
        <IconButton
          press={() => router.push("/servers/join")}
          colour="primary_a50"
          hover="primary_a30"
          icon={PlusCircle}
        />
      </Card>
      <View style={styles.content_container}>
        <Slot />
      </View>
    </View>
  );
}

export default function TabLayout() {
  const auth = use_auth();
  if (!auth.session) return <Redirect href="/login" />;

  return (
    <MeProvider>
      <LayoutInner />
    </MeProvider>
  );
}
