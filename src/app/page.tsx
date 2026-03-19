import { redirect } from "next/navigation";
import { getHasUsers, getOptionalUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [{ userId }, hasUsers] = await Promise.all([getOptionalUser(), getHasUsers()]);

  if (userId) {
    redirect("/dashboard");
  }

  redirect(hasUsers ? "/login" : "/setup");
}
