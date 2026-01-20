import { TextInput } from "@/components/atoms/input";
import {
  FormControl,
  FormProvider,
  SubmitButton,
} from "@/components/molecules/form";
import { coloured, padding, v } from "@/theme";
import { StyleSheet, View } from "react-native";
import z from "zod";

const LoginForm = z.object({
  username: z.string(),
  password: z.string(),
});

const styles = StyleSheet.create({
  container: v(padding("medium"), coloured("body"), { height: "100%" }),
});

export default function () {
  return (
    <View style={styles.container}>
      <FormProvider schema={LoginForm} submit={(v) => {}}>
        <FormControl name="username" as={TextInput}>
          Username
        </FormControl>
        <FormControl name="password" as={TextInput} sensitive>
          Password
        </FormControl>
        <SubmitButton colour="primary">Login</SubmitButton>
      </FormProvider>
    </View>
  );
}
