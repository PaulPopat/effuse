export const foreground = Object.freeze({
  body: "#fff",
  highlight: "#fff",
  error: "#4a3434",
  contrast: "#000",
  primary: "#fff",
});

export const background = Object.freeze({
  body: "#222",
  highlight: "#444",
  error: "#ffd2d2",
  contrast: "#fff",
  primary: "#33f",
});

export const border = Object.freeze({
  body: "#000",
  highlight: "#000",
  error: "#231f1f",
  contrast: "#fff",
  primary: "#000017",
});

export type ThemeColour = keyof typeof background;

export function coloured(selection: ThemeColour) {
  return {
    color: foreground[selection],
    backgroundColor: background[selection],
  };
}

export function backdrop(selection: ThemeColour) {
  return {
    backgroundColor: background[selection],
  };
}

export function content(selection: ThemeColour) {
  return {
    color: foreground[selection],
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
        borderTopColor: border[selection],
      };
    case "bottom":
      return {
        borderBottomWidth: 1,
        borderBottomColor: border[selection],
      };
    case "left":
      return {
        borderLeftWidth: 1,
        borderLeftColor: border[selection],
      };
    case "right":
      return {
        borderRightWidth: 1,
        borderRightColor: border[selection],
      };
    default:
      return {
        borderWidth: 1,
        borderColor: border[selection],
        borderRadius: 4,
      };
  }
}

export function shadowed() {
  return {
    shadowColor: "#fff",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 2, height: 2 },
    borderRadius: 4,
  };
}
