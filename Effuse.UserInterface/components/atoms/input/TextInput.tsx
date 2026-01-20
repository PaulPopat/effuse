import { bordered, content, padding, t, text } from "@/theme";
import { FormValue } from "@/utils/form";
import { TextInput as RnTextInput, StyleSheet } from "react-native";

export type TextInputProps = {
  value: FormValue;
  change: (value: FormValue) => void;
  children: never;
  invalid?: boolean;
  sensitive?: boolean;
};

export const TextInput = (props: TextInputProps) => {
  return (
    <RnTextInput
      value={props.value?.toString()}
      onChangeText={(text) => props.change(text)}
      style={styles.input}
      secureTextEntry={props.sensitive}
    />
  );
};

const styles = StyleSheet.create({
  input: t(
    text("medium"),
    padding("medium"),
    bordered("contrast", "bottom"),
    content("body"),
    {
      width: "100%",
    },
  ),
});
