import { center, content, gap, t, text, ThemeColour, v } from "@/theme";
import { FormValue } from "@/utils/form";
import { Circle, CircleCheckBig } from "lucide-react-native";
import React from "react";
import { Pressable, Text, View } from "react-native";

export type RadioOption = [FormValue, React.ReactNode];

export type RadioProps = React.PropsWithChildren & {
  value: FormValue;
  change: (value: FormValue) => void;
  options: Array<RadioOption>;
  children: never;
};

export const Radio = (props: RadioProps) => {
  return (
    <View style={v(center("column"), gap("medium"))}>
      {props.options.map(([value, display]) => (
        <Pressable
          key={value?.toString() ?? ""}
          onPress={() => props.change(value)}
          style={v(center("row"), gap("medium"), { width: "100%" })}
        >
          {props.value === value ? (
            <CircleCheckBig
              width={24}
              height={24}
              stroke={ThemeColour.light_a0}
            />
          ) : (
            <Circle width={24} height={24} stroke={ThemeColour.light_a0} />
          )}
          <Text style={t(content("light_a0"), text("medium"), { flex: 1 })}>
            {display}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};
