"use client";

import { useEffect, useState } from "react";
import { SessionData } from "@/types/AllTypes";
import { authClient } from "@/lib/auth-cliennt"; // Make sure spelling is correct: 'auth-cliennt' or 'auth-client'?
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuPortal,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuItem,
    DropdownMenuCheckboxItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";

export const DashboardUserButton = () => {
    const [session, setSession] = useState<SessionData | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchSession = async () => {
            const result = await authClient.getSession() as
                | { data: SessionData }
                | { error: any };

            if ("data" in result) {
                setSession(result.data);
            }
            setLoading(false);
        };

        fetchSession();
    }, []);


    if (loading) return null;

    if (!session) return null;

    const { user } = session;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="rounded-lg border border-border/10 p-3 w-full flex items-center justify-between bg-white/5 hover:bg-white/10 overflow-hidden">
                {user.image ? (
                    <Avatar>
                        <AvatarImage src={user.image} />
                    </Avatar>
                ) : null}
            </DropdownMenuTrigger>
        </DropdownMenu>
    );
};
