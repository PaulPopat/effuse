import { Button } from "@/components/atoms/button";
import { TextArea, TextInput } from "@/components/atoms/input";
import { Container } from "@/components/atoms/layout";
import { Heading } from "@/components/atoms/typography";
import {
  FormControl,
  FormError,
  FormProvider,
  SubmitButton,
} from "@/components/molecules/form";
import { use_me } from "@/state";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView } from "react-native";
import z from "zod";

const Form = z.object({
  server_url: z.string(),
  server_name: z.string(),
  invite_token: z.string(),
});

export default function () {
  const { add_server } = use_me();
  const query = useLocalSearchParams();

  return (
    <ScrollView>
      <Container>
        <Heading level="2" content="light_a0">
          Join a Server
        </Heading>
        <FormProvider
          schema={Form}
          submit={(v) =>
            add_server(v.server_url, v.server_name, v.invite_token)
          }
          initial={React.useMemo(
            () => ({
              server_url: query.server_url?.toString(),
              server_name: query.server_name?.toString(),
              invite_token: query.invite_token?.toString(),
            }),
            [query],
          )}
        >
          <FormError>There was an error joining the server.</FormError>
          <FormControl name="server_url" as={TextInput}>
            Server URL
          </FormControl>
          <FormControl name="server_name" as={TextInput}>
            Server Name
          </FormControl>
          <FormControl name="invite_token" as={TextArea}>
            Invite Token
          </FormControl>
          <SubmitButton backdrop="primary_a40" content="surface_a00">
            Join
          </SubmitButton>
        </FormProvider>
      </Container>
    </ScrollView>
  );
}
