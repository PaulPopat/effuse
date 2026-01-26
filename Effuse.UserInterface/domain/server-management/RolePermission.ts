export type RolePermissionProps = {
  action: string;
  resource: string;
};

export class RolePermission {
  readonly #props: RolePermissionProps;

  constructor(props: RolePermissionProps) {
    this.#props = props;
  }

  get Action() {
    return this.#props.action;
  }

  get Resource() {
    return this.#props.resource;
  }
}
