import React from "react";

export function suspended<TArgs extends Array<any>, T>(
  init: (...args: TArgs) => Promise<T>,
) {
  let cache: Promise<T>;

  return (...args: TArgs) => {
    cache = cache ?? init(...args);
    return React.use(cache);
  };
}
