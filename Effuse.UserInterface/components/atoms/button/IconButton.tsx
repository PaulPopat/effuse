import { center, margin, ThemeColour, v } from "@/theme";
import { Href, Link } from "expo-router";
import { LucideIcon } from "lucide-react-native";
import React from "react";
import { Pressable } from "react-native";

export type IconButtonProps = {
  icon: LucideIcon;
  colour: ThemeColour;
  hover?: ThemeColour;
  size?: number;
} & (
  | {
      press: () => unknown;
    }
  | {
      href: Href;
    }
);

export const IconButton = (props: IconButtonProps) => {
  const [hovering, set_hovering] = React.useState(false);
  const colour = hovering && props.hover ? props.hover : props.colour;
  const size = props.size ?? 24;

  const result = (
    <Pressable
      style={v(center("row"), margin("medium"))}
      onPress={"press" in props ? props.press : undefined}
      onHoverIn={() => set_hovering(true)}
      onHoverOut={() => set_hovering(false)}
    >
      <props.icon width={size} height={size} stroke={ThemeColour[colour]} />
    </Pressable>
  );

  if ("href" in props) {
    return (
      <Link href={props.href} asChild>
        {result}
      </Link>
    );
  }

  return result;
};
