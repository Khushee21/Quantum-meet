"use client"

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { PanelLeftCloseIcon, PanelLeftIcon, SearchIcon } from "lucide-react";
import { DashboardCommand } from "./dashboard-command";
import { useEffect, useState } from "react";
export const DashboardNavbar = () => {

    const [commandOpen, setcommandopen] = useState(false);
    const { state, toggleSidebar, isMobile } = useSidebar();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setcommandopen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, [])
    return (
        <>
            <DashboardCommand open={commandOpen} setOpen={setcommandopen} />
            <nav className="w-full  flex px-4 gap-x-2 items-center py-3 border-b bg-background ">
                <Button className="size-9" variant="outline" onClick={toggleSidebar}>
                    {(state === 'collapsed' || isMobile) ? <PanelLeftIcon className="size-4" /> : <PanelLeftCloseIcon className="size-4" />}
                </Button>
                <Button className="h-9 w-[240px] justify-start font-normal text-muted-foreground hover:text-muted-foreground "
                    variant="outline"
                    size="sm"
                    onClick={() => setcommandopen((open) => !open)}>
                    <SearchIcon />
                    Search
                </Button>
            </nav>
        </>
    )
}