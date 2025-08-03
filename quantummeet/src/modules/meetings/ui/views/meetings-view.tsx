"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { DataTable } from "@/components/data-table";
import { columns } from "../components/columns";
import { EmptyState } from "@/components/empty-state";
import { useRouter } from "next/navigation";
import { useMeetingsFilter } from "../../hooks/use-meetings-filters";
import { DataPagination } from "@/components/data-pagination";

export const MeetingView = () => {
    const trpc = useTRPC();
    const router = useRouter();
    const [filters, setFilters] = useMeetingsFilter();

    const { data, isLoading, isError } = useQuery(trpc.meetings.getMany.queryOptions({
        ...filters
    }));

    if (isLoading) return <MeetingViewLoading />;
    if (isError || !data) return <MeetingViewError />;

    return (
        <div className="overflow-x-scroll">
            <DataTable
                data={data?.items ?? []}
                columns={columns}
                onRowClick={(row) => router
                    .push(`/meetings/${row.id}`)
                }
            />
            <DataPagination
                page={filters.page}
                totalPages={data.totalPages}
                onPageChange={(page) => setFilters({ page })} />
            {data.items.length === 0 && (
                <EmptyState
                    title="Create your first meeting"
                    description="Schedule a meeting to connect with others , each meeting lets you collabrate , share ideas , and interact with participants in real time" />
            )}
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
