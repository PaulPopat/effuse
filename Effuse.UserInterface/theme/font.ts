import { Platform } from "react-native";

export const font_sizes = Object.freeze({
  extra_small: 8,
  small: 12,
  medium: 16,
  large: 22,
});

export type FontSize = keyof typeof font_sizes;

const font_family = Platform.select({
  web: "sans-serif",
  android: "Roboto",
  ios: "Avenir",
});

export function text(size: FontSize) {
  return {
    fontSize: font_sizes[size],
    fontFamily: font_family,
    lineHeight: Math.floor(font_sizes[size] * 1.2),
  };
}
