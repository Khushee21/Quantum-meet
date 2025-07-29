"use client";

import { useEffect, useState } from "react";
import { SessionData } from "@/types/AllTypes";
import { authClient } from "@/lib/auth-cliennt"; // Make sure spelling is correct: 'auth-cliennt' or 'auth-client'?
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { ChevronDownIcon, CreditCardIcon, LogOutIcon } from "lucide-react";
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
import { GeneratedAvatar } from "@/components/generated-avatar";

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

    const onLogout = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("sign-in");
                }
            }
        })
    }


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
                ) : <GeneratedAvatar seed={user.name}
                    variant="initials"
                    className="size-9 mr-3" />}
                <div className="flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0">
                    <p className="text-sm truncate w-full">
                        {user.name}
                    </p>
                    <p className="text-xs truncate w-full">
                        {user.email}
                    </p>
                </div>
                <ChevronDownIcon className="size-4  shrink-0" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="right" className="w-72">
                <DropdownMenuLabel>
                    <div className="flex flex-col gap-1">
                        <span className="font-medium truncate">{user.name}</span>
                        <span className="text-sm font-medium text-muted-foreground truncate">
                            {user.email}
                        </span>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="cursor-pointer flex items-center justify-between">
                    Billing
                    <CreditCardIcon className="size-4" />
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="cursor-pointer flex items-center justify-between"
                    onClick={onLogout}>
                    Logout
                    <LogOutIcon className="size-4" />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
