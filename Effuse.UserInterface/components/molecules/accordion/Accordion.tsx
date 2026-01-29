import React from "react";
import { AccordionContext } from "./AccordionContext";
import { View } from "react-native";

export type AccordionProps = React.PropsWithChildren;

export const Accordion = (props: AccordionProps) => {
  const [open, set_open] = React.useState("");

  const ctx = React.useMemo(
    (): AccordionContext => ({
      current: open,
      open: (id) => set_open(id),
    }),
    [open, set_open],
  );

  return (
    <AccordionContext.Provider value={ctx}>
      <View style={{ width: "100%" }}>{props.children}</View>
    </AccordionContext.Provider>
  );
};
