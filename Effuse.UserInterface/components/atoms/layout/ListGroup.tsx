import { backdrop, bordered, padding, shadowed, ThemeColour, v } from "@/theme";
import React from "react";
import { View } from "react-native";

export type ListGroupProps = React.PropsWithChildren;

export type ListGroupItemProps = React.PropsWithChildren & {
  backdrop?: ThemeColour;
};

export const ListGroup = Object.freeze(
  Object.assign(
    (props: ListGroupProps) => {
      return (
        <View style={v({ width: "100%", overflow: "hidden" }, shadowed())}>
          {props.children}
        </View>
      );
    },
    {
      Item: (props: ListGroupItemProps) => {
        return (
          <View
            style={v(
              { width: "100%" },
              backdrop(props.backdrop ?? "surface_a10"),
              padding("none", "medium"),
            )}
          >
            {props.children}
          </View>
        );
      },
    },
  ),
);
