"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MeetingGetMany } from "../../type";
import { GeneratedAvatar } from "@/components/generate-avatar";
import {
    CornerDownRightIcon,
    CircleCheckIcon,
    CircleXIcon,
    ClockArrowUpIcon,
    ClockFadingIcon,
    LoaderIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDuration } from "@/lib/utils";
import { format } from "date-fns";
import humanizeDuration from "humanize-duration";

type Meeting = MeetingGetMany[number];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const statusIconMap = {
    upcoming: ClockArrowUpIcon,
    active: LoaderIcon,
    completed: CircleCheckIcon,
    processing: LoaderIcon,
    cancelled: CircleXIcon,
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const statusColorMap = {
    upcoming: "bg-yellow-500/20 text-yellow-800 border-yellow-800/5",
    active: "bg-green-500/20 text-green-800 border-green-800/5",
    completed: "bg-emerald-500/20 text-emerald-800 border-emerald-800/5",
    processing: "bg-gray-300/20 text-gray-800 border-gray-800/5",
    cancelled: "bg-rose-500/20 text-rose-800 border-rose-800/5",
};

export const columns: ColumnDef<Meeting>[] = [
    {
        accessorKey: "name",
        header: "Meeting name",
        cell: ({ row }) => {
            const agentName = row.original.agent?.name || "Unknown";
            return (
                <div className="flex flex-col gap-y-1">
                    <span className="font-semibold capitalize">{row.original.name}</span>

                    <div className="flex items-center gap-x-2">
                        <div className="flex items-center gap-x-1">
                            <CornerDownRightIcon className="size-3 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground max-w-[200px] truncate capitalize">
                                {agentName}
                            </span>
                        </div>
                        <GeneratedAvatar
                            variant="botttsNeutral"
                            seed={agentName}
                            className="size-4"
                        />
                        <span>
                            {row.original.startedAt
                                ? format(new Date(row.original.startedAt), "MMM d")
                                : ""}
                        </span>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {

            return (
                <Badge
                    variant="outline"
                    className="capitalize [&]:size-4 flex items-center gap-x-2"
                >
                    <ClockFadingIcon
                        className="text-blue-700"
                    />
                    {row.original.duration ? formatDuration(row.original.duration) : "No duration"}
                </Badge>
            );
        },
    },
    {
        accessorKey: "duration",
        header: "Duration",
        cell: ({ row }) => (
            <Badge
                variant="outline"
                className="capitalize [&>svg]:size-4 flex items-center gap-x-2"
            >
                <ClockFadingIcon className="text-blue-700" />
                {row.original.duration
                    ? humanizeDuration(row.original.duration * 1000, {
                        largest: 1,
                        round: true,
                        units: ["h", "m", "s"],
                    })
                    : "No duration"}
            </Badge>
        ),
    },
];
