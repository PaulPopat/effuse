export type ServerEntryProps = {
  server_url: string;
  server_name: string;
};

export class ServerEntry {
  readonly #props: ServerEntryProps;

  constructor(props: ServerEntryProps) {
    this.#props = props;
  }

  get Url() {
    return this.#props.server_url;
  }

  get Name() {
    return this.#props.server_name;
  }
}
