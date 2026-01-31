import z from "zod";

export const PermissionModel = z.object({
  action: z.string(),
  resource: z.string(),
});

export type PermissionModel = z.infer<typeof PermissionModel>;

export const RoleModel = z.object({
  id: z.string(),
  name: z.string(),
  permissions: z.array(PermissionModel),
});

export type RoleModel = z.infer<typeof RoleModel>;
