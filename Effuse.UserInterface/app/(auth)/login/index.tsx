import { Button } from "@/components/atoms/button";
import { TextInput } from "@/components/atoms/input";
import { Container, Row, RowFill } from "@/components/atoms/layout";
import { Heading } from "@/components/atoms/typography";
import {
  FormControl,
  FormError,
  FormProvider,
  SubmitButton,
} from "@/components/molecules/form";
import { use_auth } from "@/state";
import { useRouter } from "expo-router";
import z from "zod";

const Form = z.object({
  username: z.string(),
  password: z.string(),
});

export default function () {
  const auth = use_auth();
  const router = useRouter();

  return (
    <Container>
      <Heading level="1" content="light_a0">
        Login
      </Heading>
      <Row>
        <RowFill />
        <Button
          backdrop="info_a20"
          content="surface_a00"
          press={() => router.push("/register")}
          small
        >
          Register
        </Button>
      </Row>
      <FormProvider
        schema={Form}
        submit={(v) => auth.login(v.username, v.password)}
      >
        <FormError>
          Some of your details did not match. Please try again.
        </FormError>
        <FormControl
          name="username"
          as={TextInput}
          auto_complete="email"
          keyboard_type="email-address"
          auto_capitalise="none"
        >
          Username or Email
        </FormControl>
        <FormControl
          name="password"
          auto_complete="password"
          as={TextInput}
          sensitive
        >
          Password
        </FormControl>
        <SubmitButton backdrop="primary_a40" content="surface_a00">
          Login
        </SubmitButton>
      </FormProvider>
    </Container>
  );
}
