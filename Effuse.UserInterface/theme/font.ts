export const font_sizes = Object.freeze({
  extra_small: 8,
  small: 12,
  medium: 16,
  large: 22,
  extra_large: 30,
});

export type FontSize = keyof typeof font_sizes;

export function text(size: FontSize) {
  return {
    fontSize: font_sizes[size],
    fontFamily: "Montserrat",
    lineHeight: Math.floor(font_sizes[size] * 1.2),
  };
}
