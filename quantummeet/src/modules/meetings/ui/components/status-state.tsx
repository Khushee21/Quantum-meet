import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { VideoIcon } from "lucide-react";

interface Props {
    meetingId: string;
    onCancelMeeting: () => void;
    isCancelling: boolean;
}

export const UpcomingState = ({
    meetingId,
    isCancelling,
}: Props) => {
    return (
        <div className="bg-blue-50 rounded-lg px-4 py-5 flex flex-col gap-y-8 items-center justify-center">
            <EmptyState
                title="Not started yet"
                description="Once you start this meeting, a summary will appear here."
            />
            <div className="flex flex-col-reverse lg:flex-row lg:justify-center items-center gap-2 w-full">
                <Button asChild className="w-full lg:w-auto" disabled={isCancelling}>
                    <Link href={`/call/${meetingId}`}>
                        <VideoIcon className="mr-2 h-4 w-4" />
                        Start Meeting
                    </Link>
                </Button>
            </div>
        </div>
    );
};

export const ActiveStatus = ({ meetingId }: { meetingId: string }) => {
    return (
        <div className="bg-blue-50 rounded-lg px-4 py-5 flex flex-col gap-y-8 items-center justify-center">
            <EmptyState
                title="Meeting is Active"
                description="Meeting will end once all participants have left."
            />
            <div className="flex flex-col-reverse lg:flex-row lg:justify-center items-center gap-2 w-full">
                <Button asChild className="w-full lg:w-auto">
                    <Link href={`/call/${meetingId}`}>
                        <VideoIcon className="mr-2 h-4 w-4" />
                        Join Meeting
                    </Link>
                </Button>
            </div>
        </div>
    );
};

export const CancelledState = () => {
    return (
        <div className="bg-blue-50 rounded-lg px-4 py-5 flex flex-col gap-y-8 items-center justify-center">
            <EmptyState
                title="Meeting Cancelled"
                description="This meeting has been cancelled. No further actions can be taken."
            />
        </div>
    );
};


export const ProcessingState = () => {
    return (
        <div className="bg-blue-50 rounded-lg px-4 py-5 flex flex-col gap-y-8 items-center justify-center">
            <EmptyState
                title="Meeting completed"
                description="This meeting has completed."
            />
        </div>
    );
};


