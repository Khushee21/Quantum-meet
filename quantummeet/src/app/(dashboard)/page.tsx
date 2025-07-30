import HomeView from "@/modules/home/ui/views/home-view";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { caller } from "@/trpc/server";

const Page = async () => {

  const greeting = await caller.hello({ text: "Antonio Server" });

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <p>{greeting.greeting}</p>
  )
  return (
    <HomeView />
  )
}

export default Page;