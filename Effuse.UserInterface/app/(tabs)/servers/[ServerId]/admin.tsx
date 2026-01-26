import { IconButton } from "@/components/atoms/button";
import { Radio, RadioOption, TextInput } from "@/components/atoms/input";
import {
  Container,
  Divider,
  ListGroup,
  Row,
  RowFill,
} from "@/components/atoms/layout";
import { Card, InvisibleCard } from "@/components/atoms/panel";
import { Heading, Paragraph } from "@/components/atoms/typography";
import {
  FormControl,
  FormError,
  FormProvider,
  SubmitButton,
} from "@/components/molecules/form";
import { use_server_management } from "@/state/server-management";
import { ThemeColour } from "@/theme";
import { MessageSquare, MicVocal, Trash } from "lucide-react-native";
import React from "react";
import { ScrollView, View } from "react-native";
import z from "zod";

const CreateChannelForm = z.object({
  channel: z.enum(["voice", "message"]),
  name: z.string(),
});

const ChannelTypeOptions: Array<RadioOption> = [
  ["voice", "Voice"],
  ["message", "Messages"],
];

export default function () {
  const server = use_server_management();

  return (
    <ScrollView contentContainerStyle={{ paddingTop: 45 }}>
      <Container>
        <Card padding="large">
          <Heading level="1" content="light_a0">
            Channels
          </Heading>
          {server.channels.map((c, i) => (
            <React.Fragment key={c.Id}>
              <Row gap="medium">
                {c.TypeName === "voice" ? (
                  <MicVocal
                    width={24}
                    height={24}
                    stroke={ThemeColour.light_a0}
                  />
                ) : (
                  <MessageSquare
                    width={24}
                    height={24}
                    stroke={ThemeColour.light_a0}
                  />
                )}
                <RowFill>
                  <Paragraph content="light_a0">{c.Name}</Paragraph>
                </RowFill>
                <IconButton
                  press={() => {}}
                  icon={Trash}
                  colour="light_a0"
                  hover="primary_a40"
                />
              </Row>
              {i !== server.channels.length - 1 && (
                <Divider colour="surface_a30" />
              )}
            </React.Fragment>
          ))}
        </Card>
        <Card padding="large">
          <Heading level="1" content="light_a0">
            Create a Channel
          </Heading>
          <FormProvider
            schema={CreateChannelForm}
            submit={async (v) => server.create_channel(v.name, v.channel)}
          >
            <FormError>There was a problem creating the channel.</FormError>
            <FormControl name="name" as={TextInput} auto_complete="off">
              Channel Name
            </FormControl>
            <FormControl name="channel" as={Radio} options={ChannelTypeOptions}>
              Channel Type
            </FormControl>
            <SubmitButton backdrop="primary_a40" content="dark_a0">
              Create Channel
            </SubmitButton>
          </FormProvider>
        </Card>
      </Container>
    </ScrollView>
  );
}
