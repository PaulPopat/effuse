import { Token } from "./Token";

export type ServerSessionProps = {
  access_token: string;
  refresh_token: string;
  expires: Date;
  token_type: string;
  base_url: string;
};

export class ServerSession {
  readonly #props: ServerSessionProps;

  constructor(props: ServerSessionProps) {
    this.#props = props;
  }

  get AccessToken() {
    return new Token(this.#props.token_type, this.#props.access_token);
  }

  get RefreshToken() {
    return new Token(this.#props.token_type, this.#props.refresh_token);
  }

  get Expires() {
    return new Date(this.#props.expires);
  }

  get NeedsRefresh() {
    return this.Expires.getTime() - Date.now() < 2000;
  }

  get BaseUrl() {
    return this.#props.base_url;
  }

  get Props() {
    return { ...this.#props };
  }
}
