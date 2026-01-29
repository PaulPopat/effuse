import { IconButton } from "@/components/atoms/button";
import { Radio, RadioOption, TextInput } from "@/components/atoms/input";
import { Container, Divider, Row, RowFill } from "@/components/atoms/layout";
import { Card, InvisibleCard } from "@/components/atoms/panel";
import { Heading, Paragraph } from "@/components/atoms/typography";
import { Accordion } from "@/components/molecules/accordion";
import {
  FormControl,
  FormError,
  FormProvider,
  SubmitButton,
} from "@/components/molecules/form";
import { use_server_management } from "@/state/server-management";
import { ThemeColour } from "@/theme";
import { MessageSquare, MicVocal, Trash, User } from "lucide-react-native";
import React from "react";
import { ScrollView } from "react-native";
import z from "zod";

const CreateChannelForm = z.object({
  channel: z.enum(["voice", "message"]),
  name: z.string(),
});

const AddPermissionForm = z.object({
  action: z.string(),
  resource: z.string(),
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
        <InvisibleCard padding="large">
          <Heading level="1" content="light_a0">
            Roles
          </Heading>
          <Accordion>
            {server.roles.map((r, i) => (
              <Accordion.Item
                key={r.Id}
                title={<Paragraph content="light_a0">{r.Name}</Paragraph>}
              >
                {r.Permissions.map((p) => (
                  <Row key={[p.Action, p.Resource].join("-")}>
                    <RowFill>
                      <Paragraph content="light_a0">
                        Action: {p.Action}
                      </Paragraph>
                    </RowFill>
                    <RowFill>
                      <Paragraph content="light_a0">
                        Resource: {p.Resource}
                      </Paragraph>
                    </RowFill>
                  </Row>
                ))}
                <Divider colour="surface_a40" spaced />
                <Heading level="2" content="light_a0">
                  Add a Permission
                </Heading>
                <FormProvider
                  schema={AddPermissionForm}
                  submit={async (v) =>
                    server.add_permission(r, v.action, v.resource)
                  }
                >
                  <FormError>
                    There was a problem adding the permission.
                  </FormError>
                  <FormControl name="action" as={TextInput} auto_complete="off">
                    Action
                  </FormControl>
                  <FormControl
                    name="resource"
                    as={TextInput}
                    auto_complete="off"
                  >
                    Resource
                  </FormControl>
                  <SubmitButton backdrop="primary_a40" content="dark_a0">
                    Add
                  </SubmitButton>
                </FormProvider>
              </Accordion.Item>
            ))}
          </Accordion>
        </InvisibleCard>
      </Container>
    </ScrollView>
  );
}
