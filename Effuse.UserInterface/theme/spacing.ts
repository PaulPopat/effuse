const padding_amounts = Object.freeze({
  none: 0,
  small: 4,
  medium: 8,
  large: 16,
});

export type PaddingAmount = keyof typeof padding_amounts;

export function padding(
  top: PaddingAmount,
  right?: PaddingAmount,
  bottom?: PaddingAmount,
  left?: PaddingAmount,
) {
  return {
    paddingTop: padding_amounts[top],
    paddingBottom: padding_amounts[bottom ?? top],
    paddingLeft: padding_amounts[left ?? right ?? top],
    paddingRight: padding_amounts[right ?? top],
  };
}

export function margin(
  top: PaddingAmount,
  right?: PaddingAmount,
  bottom?: PaddingAmount,
  left?: PaddingAmount,
) {
  return {
    marginTop: padding_amounts[top],
    marginBottom: padding_amounts[bottom ?? top],
    marginLeft: padding_amounts[left ?? right ?? top],
    marginRight: padding_amounts[right ?? top],
  };
}

export function gap(amount: PaddingAmount) {
  return {
    gap: padding_amounts[amount],
  };
}
