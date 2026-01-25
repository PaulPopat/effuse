import { bordered, content, padding, t, text } from "@/theme";
import { FormValue } from "@/utils/form";
import {
  TextInput as RnTextInput,
  StyleSheet,
  TextInputProps as RnTextInputProps,
} from "react-native";

export type TextAreaProps = {
  value: FormValue;
  change: (value: FormValue) => void;
  blur?: () => void;
  children: never;
  invalid?: boolean;
  sensitive?: boolean;
  auto_complete?: RnTextInputProps["autoComplete"];
  keyboard_type?: RnTextInputProps["keyboardType"];
};

export const TextArea = (props: TextAreaProps) => {
  return (
    <RnTextInput
      value={props.value?.toString()}
      onChangeText={(text) => props.change(text)}
      style={styles.input}
      secureTextEntry={props.sensitive}
      onBlur={props.blur}
      autoComplete={props.auto_complete}
      keyboardType={props.keyboard_type}
      multiline
    />
  );
};

const styles = StyleSheet.create({
  input: t(
    text("medium"),
    padding("medium"),
    bordered("primary_a40", "bottom"),
    content("light_a0"),
    {
      width: "100%",
      height: 200,
    },
  ),
});
