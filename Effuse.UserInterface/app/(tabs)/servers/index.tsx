import { Button } from "@/components/atoms/button";
import { TextInput } from "@/components/atoms/input";
import { Container } from "@/components/atoms/layout";
import { Heading } from "@/components/atoms/typography";
import {
  FormControl,
  FormProvider,
  SubmitButton,
} from "@/components/molecules/form";
import { use_me } from "@/state";
import { useRouter } from "expo-router";
import { ScrollView } from "react-native";
import z from "zod";

const Form = z.object({
  server_url: z.string(),
  server_name: z.string(),
});

export default function () {
  const { servers, add_server } = use_me();
  const router = useRouter();

  return (
    <ScrollView>
      <Container>
        {servers.map((s) => (
          <Button
            key={s.Url}
            backdrop="primary_a40"
            content="dark_a0"
            press={() => router.push("/servers")}
          >
            {s.Name}
          </Button>
        ))}

        <Heading level="2" content="light_a0">
          Join a Server
        </Heading>
        <FormProvider
          schema={Form}
          submit={(v) => add_server(v.server_url, v.server_name)}
        >
          <FormControl name="server_url" as={TextInput}>
            Server URL
          </FormControl>
          <FormControl name="server_name" as={TextInput}>
            Server Name
          </FormControl>
          <SubmitButton backdrop="primary_a40" content="surface_a00">
            Join
          </SubmitButton>
        </FormProvider>
      </Container>
    </ScrollView>
  );
}
