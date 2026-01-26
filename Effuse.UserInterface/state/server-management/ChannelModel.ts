import z from "zod";

export const ChannelModel = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["voice", "message"]),
  createdOn: z.string(),
});

export type ChannelModel = z.infer<typeof ChannelModel>;
