import { Token } from "@/domain/auth";
import { url, UrlProps } from "./url";
import z from "zod";

export type SendProps<TResult> = UrlProps & {
  method: string;
  body?: unknown;
  token?: Token;
  expect?: z.ZodType<TResult>;
};

export async function send<TResult>(
  props: SendProps<TResult>,
): Promise<TResult> {
  const headers = new Headers();
  if (props.token) headers.set("Authorization", props.token.toString());
  if (props.body) headers.set("Content-Type", "application/json");

  const result = await fetch(
    url({
      base: props.base,
      path: props.path,
      params: props.params,
    }),
    {
      method: props.method,
      headers,
      body: props.body ? JSON.stringify(props.body) : undefined,
    },
  );

  if (!result.ok)
    throw new Error(
      `Request to ${props.method}:${props.path} failed with status code ${result.status}`,
    );

  if (props.expect) return props.expect.parse(await result.json());
  return await result.json();
}
