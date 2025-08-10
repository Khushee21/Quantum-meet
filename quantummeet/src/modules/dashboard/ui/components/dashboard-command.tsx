import {
    CommandInput,
    CommandList,
    CommandItem,
    CommandResponsiveDialog,
    CommandGroup,
    CommandEmpty
} from "@/components/ui/command";
import { Dispatch, SetStateAction, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/client"; // ✅ client-safe import
import { GeneratedAvatar } from "@/components/generate-avatar";

interface Props {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

export const DashboardCommand = ({ open, setOpen }: Props) => {
    const router = useRouter();
    const [search, setSearch] = useState("");

    const trpc = useTRPC(); // ✅ get client instance

    const meetings = useQuery(
        trpc.meetings.getMany.queryOptions({
            status: null, // required param
            search,
            pageSize: 100,
        })
    );

    const agents = useQuery(
        trpc.agents.getMany.queryOptions({
            search,
            pageSize: 100,
        })
    );

    return (
        <CommandResponsiveDialog
            shouldFilter={false}
            open={open}
            onOpenChange={setOpen}
        >
            <CommandInput
                placeholder="Find a meeting or agent"
                value={search}
                onValueChange={(value) => setSearch(value)}
            />
            <CommandList>
                <CommandGroup heading="Meetings">
                    <CommandEmpty>
                        <span className="text-muted-foreground text-sm">
                            No meeting found
                        </span>
                    </CommandEmpty>
                    {meetings.data?.items.map((meeting) => (
                        <CommandItem
                            onSelect={() => {
                                router.push(`/meetings/${meeting.id}`);
                                setOpen(false);
                            }}
                            key={meeting.id}
                        >
                            {meeting.name}
                        </CommandItem>
                    ))}
                </CommandGroup>

                <CommandGroup heading="Agents">
                    <CommandEmpty>
                        <span className="text-muted-foreground text-sm">
                            No agents found
                        </span>
                    </CommandEmpty>
                    {agents.data?.items.map((agent) => ( // ✅ fixed to use agents.data
                        <CommandItem
                            onSelect={() => {
                                router.push(`/agents/${agent.id}`);
                                setOpen(false);
                            }}
                            key={agent.id}
                        >
                            <GeneratedAvatar
                                seed={agent.name}
                                variant="botttsNeutral"
                                className="size-5"
                            />
                            {agent.name}
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </CommandResponsiveDialog>
    );
};
