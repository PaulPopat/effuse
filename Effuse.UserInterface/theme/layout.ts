export function center(
  direction: "row" | "column" | "row-reverse" | "column-reverse",
) {
  return {
    display: "flex",
    flexDirection: direction,
    alignItems: "center",
    justifyContent: "center",
  } as const;
}
