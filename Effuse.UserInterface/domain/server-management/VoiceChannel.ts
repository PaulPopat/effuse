import { Channel } from "./Channel";

export class VoiceChannel extends Channel {
  get TypeName(): string {
    return "voice";
  }
}
