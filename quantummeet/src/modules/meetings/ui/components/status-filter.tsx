import {
    CircleXIcon,
    CircleCheckIcon,
    ClockIcon,
    VideoIcon,
    Loader2Icon
} from "lucide-react";

import { CommonSelect } from "@/modules/meetings/ui/components/command-select";
import { MeetingStatus } from "../../type";
import { useMeetingsFilter } from "../../hooks/use-meetings-filters";

const options = [
    {
        id: MeetingStatus.Upcoming,
        value: MeetingStatus.Upcoming,
        children: (
            <div className="flex items-center gap-2 capitalize">
                <ClockIcon className="w-4 h-4" />
                <span>{MeetingStatus.Upcoming}</span>
            </div>
        )
    },
    {
        id: MeetingStatus.Completed,
        value: MeetingStatus.Completed,
        children: (
            <div className="flex items-center gap-2 capitalize">
                <CircleCheckIcon className="w-4 h-4 text-green-600" />
                <span>{MeetingStatus.Completed}</span>
            </div>
        )
    },
    {
        id: MeetingStatus.Active,
        value: MeetingStatus.Active,
        children: (
            <div className="flex items-center gap-2 capitalize">
                <VideoIcon className="w-4 h-4 text-blue-600" />
                <span>{MeetingStatus.Active}</span>
            </div>
        )
    },
    {
        id: MeetingStatus.Cancelled,
        value: MeetingStatus.Cancelled,
        children: (
            <div className="flex items-center gap-2 capitalize">
                <CircleXIcon className="w-4 h-4 text-red-600" />
                <span>{MeetingStatus.Cancelled}</span>
            </div>
        )
    },
    {
        id: MeetingStatus.Processing,
        value: MeetingStatus.Processing,
        children: (
            <div className="flex items-center gap-2 capitalize">
                <Loader2Icon className="w-4 h-4 animate-spin text-yellow-500" />
                <span>{MeetingStatus.Processing}</span>
            </div>
        )
    }
];

export const MeetingStatusFilter = () => {
    const [filters, setFilters] = useMeetingsFilter();

    return (
        <CommonSelect
            placeholder="Status"
            className="h-9 w-[200px] truncate"
            options={options}
            onSelect={(value) => setFilters({ status: value as MeetingStatus })}
            value={filters.status ?? ""}
        />
    );
};
