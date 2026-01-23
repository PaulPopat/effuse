export type ExecuteArea = "effuse" | "maildev" | "server";

export type ExecuteProps = {
  url: string;
  query?: Record<string, string>;
  method: string;
  body?: unknown;
  area?: ExecuteArea;
  headers?: Record<string, string>;
};

export const base_urls: Record<ExecuteArea, string> = {
  effuse: process.env.EFFUSE_URL ?? "http://localhost:8080",
  maildev: process.env.MAILDEV_URL ?? "http://localhost:1080",
  server: process.env.SERVER_URL ?? "http://localhost:8082",
};

export async function Execute(props: ExecuteProps): Promise<any> {
  const url = new URL(props.url, base_urls[props.area ?? "effuse"]);
  for (const key in props.query) {
    url.searchParams.set(key, props.query?.[key] ?? "");
  }

  const response = await fetch(url, {
    method: props.method,
    body: props.body ? JSON.stringify(props.body) : undefined,
    headers: {
      ...props.headers,
      "Content-Type": props.body ? "application/json" : "",
    },
  });

  if (!response.ok)
    throw new Error(`Bad response from ${url} of ${response.status}`);

  return await response.json();
}
