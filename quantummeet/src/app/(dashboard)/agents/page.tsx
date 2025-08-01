import { AgentsLoading, AgentsView, AgentsViewError } from "@/modules/agents/ui/views/agent-view";
import { getQueryClient } from "@/trpc/server";
import { trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import ListHeader from "@/modules/agents/ui/components/agents-list-header";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SearchParams } from "next/dist/server/request/search-params";
import { loadSearchParams } from "@/modules/agents/params";

interface Props {
    searchParams: Promise<SearchParams>;
}

const Page = async ({ searchParams }: Props) => {

    const filters = await loadSearchParams(searchParams);

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/sign-in");
    }

    const queryClient = getQueryClient();

    await queryClient.prefetchQuery(trpc.agents.getMany.queryOptions({
        ...filters,
    }));

    return (
        <>
            <ListHeader />
            <HydrationBoundary state={dehydrate(queryClient)}>
                <Suspense fallback={<AgentsLoading />}>
                    <ErrorBoundary fallback={<AgentsViewError />}>
                        <AgentsView />
                    </ErrorBoundary>
                </Suspense>
            </HydrationBoundary>
        </>
    );
};

export default Page;
