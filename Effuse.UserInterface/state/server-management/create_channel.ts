import {
  VoiceChannel,
  MessageChannel,
  Channel,
} from "@/domain/server-management";
import { ChannelModel } from "./ChannelModel";

const Channels = {
  voice: VoiceChannel,
  message: MessageChannel,
};

export function create_channel(c: ChannelModel): Channel {
  return new Channels[c.type]({
    id: c.id,
    name: c.name,
    created_on: new Date(c.createdOn),
  });
}
