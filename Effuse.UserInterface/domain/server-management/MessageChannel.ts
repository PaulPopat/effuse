import { Channel } from "./Channel";

export class MessageChannel extends Channel {
  get TypeName(): string {
    return "message";
  }
}
