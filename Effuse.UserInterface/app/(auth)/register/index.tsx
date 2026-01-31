import { Button } from "@/components/atoms/button";
import { TextInput } from "@/components/atoms/input";
import { Row, RowFill, Container } from "@/components/atoms/layout";
import { Heading } from "@/components/atoms/typography";
import {
  FormControl,
  FormError,
  FormProvider,
  SubmitButton,
} from "@/components/molecules/form";
import { use_auth } from "@/state";
import z from "zod";

const Form = z.object({
  email: z.string(),
});

export default function () {
  const auth = use_auth();

  return (
    <Container full_height>
      <Heading level="1" content="light_a0">
        Register
      </Heading>
      <Row>
        <RowFill />
        <Button backdrop="info_a20" content="surface_a00" href="/login" small>
          Login
        </Button>
      </Row>
      <FormProvider schema={Form} submit={(v) => auth.start_register(v.email)}>
        <FormError>
          There was a problem submitting your email. Please try again.
        </FormError>
        <FormControl
          name="email"
          as={TextInput}
          auto_complete="email"
          keyboard_type="email-address"
          auto_capitalise="none"
        >
          Email Address
        </FormControl>
        <SubmitButton backdrop="primary_a40" content="surface_a00">
          Verify Email
        </SubmitButton>
      </FormProvider>
    </Container>
  );
}
