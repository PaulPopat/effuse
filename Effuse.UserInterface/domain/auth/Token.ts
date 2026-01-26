export class Token {
  readonly #type: string;
  readonly #value: string;

  constructor(type: string, value: string) {
    this.#type = type;
    this.#value = value;
  }

  get Value() {
    return this.#value;
  }

  toString() {
    return [this.#type, this.#value].join(" ");
  }
}
