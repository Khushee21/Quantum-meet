"use client"
import { Button } from "@/components/ui/button";
import { PlusIcon, XCircleIcon } from "lucide-react";
import { NewMeetingDailog } from "./new-meeting-dailog";
import { useState } from "react";
import { MeetingSearchFilter } from "./meetings-seacrh-filter";
import { MeetingStatusFilter } from "./status-filter";
import { AgentIdFilter } from "./agent-id-filter";
import { useMeetingsFilter } from "../../hooks/use-meetings-filters";
const MeetingsListHeader = () => {
    const [isDailogOpen, setIsDailogOpen] = useState(false);
    const [filters, setFilters] = useMeetingsFilter();

    const isAnyFilterModified = !!filters.status || !!filters.search || !!filters.agentId;

    const onClearFilters = () => {
        setFilters({
            status: null,
            agentId: "",
            search: "",
            page: 1,
        });
    }

    return (
        <>
            <NewMeetingDailog
                open={isDailogOpen}
                onOpenChange={setIsDailogOpen}
            />
            <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
                <div className="flex items-center justify-between">
                    <h5 className="font-medium text-xl">My Meetings</h5>
                    <Button onClick={() => { setIsDailogOpen(true) }}>
                        <PlusIcon />
                        New Meeting
                    </Button>
                </div>
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 p-1">
                    <MeetingSearchFilter />
                    <MeetingStatusFilter />
                    <AgentIdFilter />
                    {isAnyFilterModified && (
                        <Button variant="outline" onClick={onClearFilters}>
                            <XCircleIcon className="size-4" />
                            Clear
                        </Button>
                    )}
                </div>

            </div>
        </>
    )
}

export default MeetingsListHeader;








