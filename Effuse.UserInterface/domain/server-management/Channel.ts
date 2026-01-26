export type ChannelProps = {
  id: string;
  name: string;
  created_on: Date;
};

export abstract class Channel {
  readonly #props: ChannelProps;

  constructor(props: ChannelProps) {
    this.#props = props;
  }

  get Id() {
    return this.#props.id;
  }

  get Name() {
    return this.#props.name;
  }

  get CreatedOn() {
    return new Date(this.#props.created_on);
  }

  abstract get TypeName(): string;
}
