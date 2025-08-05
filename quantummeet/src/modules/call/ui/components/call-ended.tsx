"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export const CallEnded = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-radial from-sidebar-accent">
            <div className="flex flex-col items-center justify-center w-full max-w-md p-8 gap-y-6 bg-background rounded-lg shadow-md ">
                <div className="flex flex-col gap-y-2 text-center">
                    <h6 className="text-lg font-medium">You have ended the call</h6>
                    <p className="text-sm">Summary will appear in a few minutes</p>
                </div>
                <Button asChild >
                    <Link href="/meetings">
                        Back to meetings
                    </Link>
                </Button>
            </div>
        </div>
    );

};
