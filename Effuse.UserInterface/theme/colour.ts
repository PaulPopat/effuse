export const ThemeColour = Object.freeze({
  dark_a0: "#000000",
  light_a0: "#ffffff",

  primary_a00: "#422cd1",
  primary_a10: "#6043d7",
  primary_a20: "#7959dd",
  primary_a30: "#8f70e2",
  primary_a40: "#a387e8",
  primary_a50: "#b69eed",

  surface_a00: "#121212",
  surface_a10: "#282828",
  surface_a20: "#3f3f3f",
  surface_a30: "#575757",
  surface_a40: "#717171",
  surface_a50: "#8b8b8b",

  surface_tonal_a00: "#1a1623",
  surface_tonal_a10: "#2f2b38",
  surface_tonal_a20: "#46424d",
  surface_tonal_a30: "#5d5a64",
  surface_tonal_a40: "#76737c",
  surface_tonal_a50: "#908d95",

  success_a00: "#22946e",
  success_a10: "#47d5a6",
  success_a20: "#9ae8ce",

  warning_a00: "#a87a2a",
  warning_a10: "#d7ac61",
  warning_a20: "#ecd7b2",

  danger_a00: "#9c2121",
  danger_a10: "#d94a4a",
  danger_a20: "#eb9e9e",

  info_a00: "#21498a",
  info_a10: "#4077d1",
  info_a20: "#92b2e5",
});

export type ThemeColour = keyof typeof ThemeColour;

export function backdrop(selection: ThemeColour) {
  return {
    backgroundColor: ThemeColour[selection],
  };
}

export function content(selection: ThemeColour) {
  return {
    color: ThemeColour[selection],
  };
}

export function bordered(
  selection: ThemeColour,
  direction?: "top" | "bottom" | "left" | "right",
) {
  switch (direction) {
    case "top":
      return {
        borderTopWidth: 1,
        borderTopColor: ThemeColour[selection],
      };
    case "bottom":
      return {
        borderBottomWidth: 1,
        borderBottomColor: ThemeColour[selection],
      };
    case "left":
      return {
        borderLeftWidth: 1,
        borderLeftColor: ThemeColour[selection],
      };
    case "right":
      return {
        borderRightWidth: 1,
        borderRightColor: ThemeColour[selection],
      };
    default:
      return {
        borderWidth: 1,
        borderColor: ThemeColour[selection],
        borderRadius: 4,
      };
  }
}

export function shadowed(colour?: ThemeColour) {
  return {
    shadowColor: ThemeColour[colour ?? "surface_tonal_a50"],
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 2, height: 2 },
    borderRadius: 4,
  };
}

export function rounded() {
  return {
    borderRadius: 4,
  };
}
