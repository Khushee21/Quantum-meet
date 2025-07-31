"use client"
import { Button } from "@/components/ui/button";
import { PlusIcon, XCircleIcon } from "lucide-react";
import { NewAgentDailog } from "./new-agent-dailog";
import { useState } from "react";
import { useAgentsFilter } from "../../hooks/use-agents-filters";
import { AgentSearchFilter } from "./agent-seacrh-filter";
const ListHeader = () => {

    const [filters, setFilters] = useAgentsFilter();
    const [isDailogOpen, setIsdailogOpen] = useState(false);

    const isAnyFilterModified = !!filters.search;

    const onClearFilter = () => {
        setFilters({
            search: " ",
            page: 10,
        })
    }

    return (
        <>
            <NewAgentDailog open={isDailogOpen} onOpenChange={setIsdailogOpen} />
            <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
                <div className="flex items-center justify-between">
                    <h5 className="font-medium text-xl">My Agents</h5>
                    <Button onClick={() => setIsdailogOpen(true)}>
                        <PlusIcon />
                        New Agent
                    </Button>
                </div>
                <div className="flex items-center gap-x-2 p-1">
                    <AgentSearchFilter />
                    {isAnyFilterModified && (
                        <Button variant="outline" size="sm" onClick={onClearFilter}>
                            <XCircleIcon />
                            Clear
                        </Button>
                    )}
                </div>
            </div>
        </>
    )
}

export default ListHeader;








