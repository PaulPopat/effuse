import { suspended } from "@/utils/suspended";
import { ServerSession } from "@/domain/auth";
import z from "zod";
import { send } from "@/utils/api";
import {
  Role,
  RolePermission,
  VoiceChannel,
  MessageChannel,
} from "@/domain/server-management";
import { RoleModel } from "./RoleModel";
import { ChannelModel } from "./ChannelModel";
import { create_channel } from "./create_channel";

export const use_setup = suspended(async (session: ServerSession) => {
  const roles = await send({
    base: session.BaseUrl,
    path: "/roles",
    method: "GET",
    token: session.AccessToken,
    expect: z.array(RoleModel),
  });

  const channels = await send({
    base: session.BaseUrl,
    path: "/channels",
    method: "GET",
    token: session.AccessToken,
    expect: z.array(ChannelModel),
  });

  const Channels = {
    voice: VoiceChannel,
    message: MessageChannel,
  };

  return {
    session,
    roles: roles.map(
      (r) =>
        new Role({
          id: r.id,
          name: r.name,
          permission: r.permissions.map(
            (p) =>
              new RolePermission({ action: p.action, resource: p.resource }),
          ),
        }),
    ),
    channels: channels.map(create_channel),
  };
});
