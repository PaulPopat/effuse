import { Accordion as Original, AccordionProps } from "./Accordion";
import { AccordionItem, AccordionItemProps } from "./AccordionItem";

export { AccordionItemProps, AccordionProps };

export const Accordion = Object.freeze(
  Object.assign(Original, { Item: AccordionItem }),
);
