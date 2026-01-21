export async function getItemAsync(key: string) {
  return sessionStorage.getItem(key);
}

export async function setItemAsync(key: string, value: string | null) {
  if (!value) sessionStorage.removeItem(key);
  else sessionStorage.setItem(key, value);
}
