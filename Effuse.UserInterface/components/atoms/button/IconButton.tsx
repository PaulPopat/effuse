import { center, margin, ThemeColour, v } from "@/theme";
import { LucideIcon } from "lucide-react-native";
import React from "react";
import { Pressable } from "react-native";

export type IconButtonProps = {
  press: () => void;
  icon: LucideIcon;
  colour: ThemeColour;
  hover?: ThemeColour;
  size?: number;
};

export const IconButton = (props: IconButtonProps) => {
  const [hovering, set_hovering] = React.useState(false);
  const colour = hovering && props.hover ? props.hover : props.colour;
  const size = props.size ?? 24;

  return (
    <Pressable
      style={v(center("row"), margin("medium"))}
      onPress={props.press}
      onHoverIn={() => set_hovering(true)}
      onHoverOut={() => set_hovering(false)}
    >
      <props.icon width={size} height={size} stroke={ThemeColour[colour]} />
    </Pressable>
  );
};
