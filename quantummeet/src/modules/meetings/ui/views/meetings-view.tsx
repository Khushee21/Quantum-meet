"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { DataTable } from "@/components/data-table";
import { columns } from "../components/columns";

export const MeetingView = () => {
    const trpc = useTRPC();
    const { data, isLoading, isError } = useQuery(trpc.meetings.getMany.queryOptions({}));

    if (isLoading) return <MeetingViewLoading />;
    if (isError || !data) return <MeetingViewError />;

    return (
        <div className="overflow-x-scroll">
            <DataTable
                data={data?.items ?? []}
                columns={columns}
            />
        </div>
    );
};

export const MeetingViewLoading = () => {
    return (
        <LoadingState
            title="Loading Meetings"
            description="This may take a few seconds..." />
    );
};

export const MeetingViewError = () => {
    return (
        <ErrorState
            title="Error Loading Meetings"
            description="Something went wrong..." />
    );
};
