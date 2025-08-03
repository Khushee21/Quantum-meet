"use client";

import { useEffect, useState } from "react";
import { SessionData } from "@/types/AllTypes";
import { authClient } from "@/lib/auth-cliennt";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import {
    ChevronDownIcon,
    CreditCardIcon,
    LogOutIcon,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
    Drawer,
    DrawerTrigger,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { GeneratedAvatar } from "@/components/generate-avatar";

export const DashboardUserButton = () => {
    const [session, setSession] = useState<SessionData | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const isMobile = useIsMobile();

    useEffect(() => {
        const fetchSession = async () => {
            type AuthResult =
                | { data: SessionData }
                | { error: { message: string; code?: string } };

            const result = (await authClient.getSession()) as AuthResult;


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
                    router.push("/sign-in");
                },
            },
        });
    };

    if (loading || !session) return null;

    const { user } = session;

    const avatar = user.image ? (
        <Avatar>
            <AvatarImage src={user.image} />
        </Avatar>
    ) : (
        <GeneratedAvatar seed={user.name} variant="initials" className="size-9 mr-3" />
    );

    return isMobile ? (
        <Drawer>
            <DrawerTrigger asChild>
                <Button
                    variant="outline"
                    className="rounded-lg border border-border/10 p-3 w-full flex items-center justify-between bg-white/5 hover:bg-white/10 overflow-hidden gap-x-2 "
                >
                    {avatar}
                    <div className="flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0">
                        <p className="text-sm truncate w-full">{user.name}</p>
                        <p className="text-xs truncate w-full">{user.email}</p>
                    </div>
                    <ChevronDownIcon className="size-4 shrink-0" />
                </Button>
            </DrawerTrigger>
            <DrawerContent className="fixed bottom-0 left-0 right-0 mt-auto rounded-t-lg">
                <DrawerHeader>
                    <DrawerTitle>{user.name}</DrawerTitle>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                </DrawerHeader>
                <div className="flex flex-col gap-2 px-4 pb-4">
                    <Button variant="outline" className="justify-between" onClick={() => alert("Billing")}>
                        Billing
                        <CreditCardIcon className="size-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="justify-between"
                        onClick={onLogout}
                    >
                        Logout
                        <LogOutIcon className="size-4" />
                    </Button>
                </div>
            </DrawerContent>
        </Drawer>
    ) : (
        <DropdownMenu>
            <DropdownMenuTrigger className="rounded-lg border border-border/10 p-3 w-full flex items-center justify-between bg-white/5 hover:bg-white/10 overflow-hidden gap-x-2">
                {avatar}
                <div className="flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0">
                    <p className="text-sm truncate w-full">{user.name}</p>
                    <p className="text-xs truncate w-full">{user.email}</p>
                </div>
                <ChevronDownIcon className="size-4 shrink-0" />
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
                    className="cursor-pointer flex items-center justify-between"
                    onClick={() => alert("Billing")}
                >
                    Billing
                    <CreditCardIcon className="size-4" />
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="cursor-pointer flex items-center justify-between"
                    onClick={onLogout}
                >
                    Logout
                    <LogOutIcon className="size-4" />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
