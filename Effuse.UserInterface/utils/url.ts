export type UrlProps = {
  base: string;
  path: string;
  params?: Record<string, string | Array<string>>;
};

export function url(props: UrlProps) {
  let path = props.path;
  let query: Array<string> = [];

  for (const [key, value] of Object.entries(props.params ?? {}))
    if (Array.isArray(value))
      query = [
        ...query,
        ...value.map((v) =>
          [encodeURIComponent(key), encodeURIComponent(v)].join("="),
        ),
      ];
    else if (path.includes(":" + key))
      path = path.replace(":" + key, encodeURIComponent(value));
    else
      query = [
        ...query,
        [encodeURIComponent(key), encodeURIComponent(value)].join("="),
      ];

  if (path.startsWith("/")) path = path.replace("/", "");

  const base = props.base.endsWith("/")
    ? props.base.substring(0, props.base.length - 1)
    : props.base;

  return [base, path].join("/");
}
