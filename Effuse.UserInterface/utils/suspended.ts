import React from "react";

export function suspended<T>(init: () => Promise<T>) {
  let cache: Promise<T>;

  return () => {
    cache = cache ?? init();
    return React.use(cache);
  };
}
