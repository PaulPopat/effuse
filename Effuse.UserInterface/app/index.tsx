import { use_auth } from "@/state";
import { Redirect } from "expo-router";

export default function () {
  const auth = use_auth();

  if (!!auth.session) return <Redirect href="/servers" />;
  return <Redirect href="/auth/login" />;
}
