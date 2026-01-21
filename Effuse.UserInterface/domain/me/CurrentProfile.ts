export type CurrentProfileProps = {
  username: string;
  biography: string | null;
  icon_url: string | null;
};

export class CurrentProfile {
  readonly #props: CurrentProfileProps;

  constructor(props: CurrentProfileProps) {
    this.#props = props;
  }

  get Username() {
    return this.#props.username;
  }

  get Biography() {
    return this.#props.biography;
  }

  get IconUrl() {
    return this.#props.icon_url;
  }
}
