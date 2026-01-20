import { Button, ButtonProps } from "@/components/atoms/button";
import React from "react";
import { FormContext } from "./FormContext";

export type SubmitButtonProps = Omit<ButtonProps, "press">;

export const SubmitButton = (props: SubmitButtonProps) => {
  const ctx = React.useContext(FormContext);
  if (!ctx) throw new Error("Must be within a form provider");

  return (
    <Button {...props} press={ctx.submit}>
      {props.children}
    </Button>
  );
};
