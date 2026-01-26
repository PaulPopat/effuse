import { center, content, gap, t, text, ThemeColour, v } from "@/theme";
import { Href, useRouter } from "expo-router";
import { LucideIcon } from "lucide-react-native";
import React from "react";
import { Pressable, Text } from "react-native";

export type IconLinkProps = React.PropsWithChildren & {
  href: Href;
  icon: LucideIcon;
  colour: ThemeColour;
  hover?: ThemeColour;
};

export const IconLink = (props: IconLinkProps) => {
  const router = useRouter();
  const [hovering, set_hovering] = React.useState(false);
  const colour = hovering && props.hover ? props.hover : props.colour;

  return (
    <Pressable
      style={v(center("row"), gap("medium"))}
      onPress={() => router.push(props.href)}
      onHoverIn={() => set_hovering(true)}
      onHoverOut={() => set_hovering(false)}
    >
      <props.icon width={24} height={24} stroke={ThemeColour[colour]} />
      <Text
        style={t(content(colour), text("medium"), {
          textDecorationLine: hovering ? "underline" : "none",
        })}
      >
        {props.children}
      </Text>
    </Pressable>
  );
};
