import Link from "next/link";
import { RocketIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { MAX_FREE_AGENTS, MAX_FREE_MEETINGS } from "@/modules/premium/constants";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";

export const DashboardTrial = () => {
    const trpc = useTRPC();
    const { data } = useQuery(trpc.premium.getFreeUsage.queryOptions());

    if (!data) return null;

    const agentPct = (data.agentCount / MAX_FREE_AGENTS) * 100;
    const meetingPct = (data.meetingCount / MAX_FREE_MEETINGS) * 100;

    return (
        <div className="border border-border/10 rounded-lg w-full bg-white/5 flex flex-col">
            <div className="p-3 flex flex-col gap-y-4">

                <div className="flex items-center gap-2">
                    <RocketIcon className="size-4" />
                    <p className="text-sm font-medium">Free Trial</p>
                </div>

                <div className="flex flex-col gap-y-2">
                    <p className="text-xs pt-1">
                        {data.agentCount}/{MAX_FREE_AGENTS} Agents
                    </p>
                    <progress
                        value={agentPct}
                        max={100}
                        className="h-2 w-full overflow-hidden rounded-full [&::-webkit-progress-bar]:bg-gray-200 [&::-webkit-progress-value]:bg-blue-800 [&::-moz-progress-bar]:bg-blue-800"
                    />
                </div>

                <div className="flex flex-col gap-y-2">
                    <p className="text-xs pt-1">
                        {data.meetingCount}/{MAX_FREE_MEETINGS} Meetings
                    </p>
                    <progress
                        value={meetingPct}
                        max={100}
                        className="h-2 w-full overflow-hidden rounded-full [&::-webkit-progress-bar]:bg-gray-200 [&::-webkit-progress-value]:bg-blue-800 [&::-moz-progress-bar]:bg-blue-800"
                    />
                </div>
            </div>

            <Button
                asChild
                className="bg-transparent border-t border-border/10 hover:bg-white/10 rounded-t-none"
            >
                <Link href="/upgrade">Upgrade</Link>
            </Button>
        </div>
    );
};
