import React from "react";
import { Pressable, View } from "react-native";
import uuid from "react-native-uuid";
import { AccordionContext } from "./AccordionContext";
import { Row, RowFill, SlideDown } from "@/components/atoms/layout";
import { ChevronDownCircle, ChevronUpCircle } from "lucide-react-native";
import { backdrop, margin, padding, shadowed, ThemeColour, v } from "@/theme";

export type AccordionItemProps = React.PropsWithChildren & {
  title: React.ReactNode;
  title_backdrop?: ThemeColour;
  title_icon?: ThemeColour;
};

export const AccordionItem = (props: AccordionItemProps) => {
  const id = React.useMemo(() => uuid.v4(), []);
  const ctx = React.useContext(AccordionContext);
  const open = ctx.current === id;
  const Icon = open ? ChevronUpCircle : ChevronDownCircle;

  return (
    <>
      <Pressable
        onPress={() => ctx.open(id)}
        style={v(
          backdrop(props.title_backdrop ?? "surface_a10"),
          padding("medium", "large"),
          shadowed(),
          margin("medium", "none"),
          { width: "100%" },
        )}
      >
        <Row>
          <RowFill>{props.title}</RowFill>
          <Icon
            stroke={ThemeColour[props.title_icon ?? "light_a0"]}
            width={24}
            height={24}
          />
        </Row>
      </Pressable>
      <SlideDown open={open}>
        <View style={v(margin("medium"))}>{props.children}</View>
      </SlideDown>
    </>
  );
};
