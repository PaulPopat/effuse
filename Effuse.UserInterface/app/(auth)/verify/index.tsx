import { TextInput } from "@/components/atoms/input";
import { Container } from "@/components/atoms/layout";
import { Heading } from "@/components/atoms/typography";
import {
  FormControl,
  FormProvider,
  SubmitButton,
} from "@/components/molecules/form";
import { use_auth } from "@/state";
import { useLocalSearchParams } from "expo-router";
import z from "zod";

const Form = z
  .object({
    username: z.string(),
    password: z.string(),
    repeat_password: z.string(),
  })
  .refine((f) => f.password === f.repeat_password, {
    error: "Must Match",
    path: ["password"],
  });

const Query = z.object({
  token: z.string(),
  email: z.string(),
});

export default function () {
  const auth = use_auth();
  const query = Query.parse(useLocalSearchParams());

  return (
    <Container full_height>
      <Heading level="1" content="light_a0">
        Complete Your Registration
      </Heading>
      <FormProvider
        schema={Form}
        submit={(v) =>
          auth.register(v.username, query.email, v.password, query.token)
        }
      >
        <FormControl name="username" as={TextInput}>
          Username
        </FormControl>
        <FormControl name="password" as={TextInput} sensitive>
          Password
        </FormControl>
        <FormControl name="repeat_password" as={TextInput} sensitive>
          Repeat Password
        </FormControl>
        <SubmitButton backdrop="primary_a40" content="surface_a00">
          Create Your Account
        </SubmitButton>
      </FormProvider>
    </Container>
  );
}
