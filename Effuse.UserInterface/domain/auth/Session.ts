import { Token } from "./Token";

export type SessionProps = {
  access_token: string;
  refresh_token: string;
  server_token: string;
  expires: Date;
  token_type: string;
};

export class Session {
  readonly #props: SessionProps;

  constructor(props: SessionProps) {
    this.#props = props;
  }

  get AccessToken() {
    return new Token(this.#props.token_type, this.#props.access_token);
  }

  get RefreshToken() {
    return new Token(this.#props.token_type, this.#props.refresh_token);
  }

  get ServerToken() {
    return new Token(this.#props.token_type, this.#props.server_token);
  }

  get Expires() {
    return new Date(this.#props.expires);
  }

  get NeedsRefresh() {
    return this.Expires.getTime() - Date.now() < 2000;
  }

  get Props() {
    return { ...this.#props };
  }
}
