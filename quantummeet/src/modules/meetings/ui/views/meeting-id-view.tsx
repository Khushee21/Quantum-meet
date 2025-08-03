"use client"
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { MeetingIdViewHeader } from "../components/meeting-id-view=-header";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useConfirm } from "../../hooks/use-confirm";
import { useMeetingsFilter } from "../../hooks/use-meetings-filters";
import { UpdateMeetingDailog } from "../components/update-meeting-dailog";
import { useState } from "react";

interface Props {
    meetingId: string;
}

export const MeetingIdView = ({ meetingId }: Props) => {

    const [updateMeetingDailog, setUpdateMeetingDailog] = useState(false);
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(
        trpc.meetings.getOne.queryOptions({ id: meetingId }),
    );

    const queryClient = useQueryClient();
    const router = useRouter();

    const [filters, setFilters] = useMeetingsFilter();
    const removeMeeting = useMutation(
        trpc.agents.remove.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({
                    ...filters
                }));
                router.push("/agents");
            },
            onError: (error) => {
                toast.error(error.message);
            }
        })
    );

    const [RemoveConfirmation, confirmRemove] = useConfirm(
        "Are you sure?",
        `The following action will remove this meetings`
    )

    const handleRemoveMethod = async () => {
        const ok = await confirmRemove();

        if (!ok) return;
        console.log("hello");

        await removeMeeting.mutateAsync({ id: meetingId });
    }


    return (
        <>
            <RemoveConfirmation />
            <UpdateMeetingDailog
                open={updateMeetingDailog}
                onOpenChange={setUpdateMeetingDailog}
                initialValue={data}
            />
            <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
                <MeetingIdViewHeader
                    meetingId={meetingId}
                    meetingName={data.name}
                    onEdit={() => { setUpdateMeetingDailog(true) }}
                    onRemove={handleRemoveMethod} />
                {JSON.stringify(data, null, 2)}
            </div>
        </>
    )
};

export const MeetingViewLoading = () => {
    return (
        <LoadingState
            title="Loading Meeting"
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