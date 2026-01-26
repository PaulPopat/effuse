import z from "zod";

export const RoleModel = z.object({
  id: z.string(),
  name: z.string(),
  permissions: z.array(z.object({ action: z.string(), resource: z.string() })),
});
