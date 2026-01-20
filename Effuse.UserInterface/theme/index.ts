import { TextStyle, ViewStyle } from "react-native";

export * from "./spacing";
export * from "./layout";
export * from "./colour";
export * from "./font";

export function v(...parts: Array<ViewStyle>) {
  return parts.reduce(
    (result, next) => ({ ...result, ...next }),
    {} as Partial<ViewStyle>,
  );
}

export function t(...parts: Array<TextStyle>) {
  return parts.reduce(
    (result, next) => ({ ...result, ...next }),
    {} as Partial<TextStyle>,
  );
}
