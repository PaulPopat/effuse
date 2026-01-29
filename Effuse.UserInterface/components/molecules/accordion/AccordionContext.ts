import React from "react";

export type AccordionContext = {
  open: (id: string) => void;
  current: string;
};

export const AccordionContext = React.createContext<AccordionContext>(
  {} as AccordionContext,
);
