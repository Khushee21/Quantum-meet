"use client"

import { useTRPC } from "@/trpc/client"
import { useQuery } from "@tanstack/react-query";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";

export const MeetingView = () => {

    const trpc = useTRPC();
    const { data } = useQuery(trpc.meetings.getMany.queryOptions({}));
    return (
        <div>
            {JSON.stringify(data)}
        </div>
    )
}

export const MeetingViewLoading = () => {
    return (
        <LoadingState
            title="Loading Meetings"
            description="This may take a few seconds.." />
    )
}

export const MeetingViewError = () => {
    return (
        <ErrorState
            title="Error Loading Meeting"
            description="Something went wrong.." />
    )
}