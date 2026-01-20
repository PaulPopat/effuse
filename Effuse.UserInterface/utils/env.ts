const require = (value: string | undefined) => {
  if (!value) throw new Error("Environment variable is required");

  return value;
};

export const AUTH_BASE_URL = require(process.env.EXPO_PUBLIC_AUTH_BASE);
