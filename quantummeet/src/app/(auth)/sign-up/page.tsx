
import { SignUpView } from "@/modules/auth/ui/views/sign-up-view";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const Page = async () => {

    const session = await auth.api.getSession({
        headers: await headers(),
    })
    if (!!session) {
        redirect("/");
    }
    return (
        <div>
            <SignUpView />
        </div>
    )
}

export default Page;