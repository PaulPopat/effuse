import { Card } from "@/components/atoms/panel";
import { IconLink } from "@/components/atoms/typography";
import { use_me } from "@/state";
import { ServerAuthProvider } from "@/state/server-auth";
import { ServerManagementProvider } from "@/state/server-management";
import { Slot, useLocalSearchParams } from "expo-router";
import { Settings, TvMinimal } from "lucide-react-native";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function RootLayout() {
  const { ServerId } = useLocalSearchParams();
  const me = use_me();
  const server = me.servers.find((s) => s.Id === ServerId);
  if (!server) return <></>;

  return (
    <ServerAuthProvider base_url={server.Url}>
      <ServerManagementProvider>
        <View style={styles.container}>
          <Slot />
          <View style={styles.panel}>
            <Card direction="row">
              <IconLink
                icon={TvMinimal}
                href={`/servers/${ServerId}/channels`}
                colour="light_a0"
                hover="primary_a50"
              >
                Channels
              </IconLink>
              <IconLink
                icon={Settings}
                href={`/servers/${ServerId}/admin`}
                colour="light_a0"
                hover="primary_a50"
              >
                Admin
              </IconLink>
            </Card>
          </View>
        </View>
      </ServerManagementProvider>
    </ServerAuthProvider>
  );
}

const styles = StyleSheet.create({
  container: { position: "relative", height: "100%" },
  panel: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    width: 250,
    margin: "auto",
  },
});
