import { RolePermission } from "./RolePermission";

export type RoleProps = {
  id: string;
  name: string;
  permission: Array<RolePermission>;
};

export class Role {
  readonly #props: RoleProps;

  constructor(props: RoleProps) {
    this.#props = props;
  }

  get Id() {
    return this.#props.id;
  }

  get Name() {
    return this.#props.name;
  }

  get Permissions() {
    return this.#props.permission;
  }
}
