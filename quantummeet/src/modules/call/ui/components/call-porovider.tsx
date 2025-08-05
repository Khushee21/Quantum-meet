"use client";

import { LoaderIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-cliennt";
import { generateAvatarUri } from "@/lib/avatar";
import { SessionData } from "@/types/AllTypes";
import { CallConnect } from "./call-connect";

interface Props {
    meetingId: string;
    meetingName: string;
}

export const CallProvider = ({ meetingId, meetingName }: Props) => {
    const [data, setSession] = useState<SessionData | null>(null);
    const [loading, setLoading] = useState(true);

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

    if (loading || !data) {
        return (
            <div className="flex h-screen items-center justify-center bg-radial from-sidebar-accent">
                <LoaderIcon className="size-8 animate-spin text-white" />
            </div>
        );
    }

    return (
        <CallConnect
            meetingId={meetingId}
            meetingName={meetingName}
            userId={data.user.id}
            userName={data.user.name}
            userImage={
                data.user.image ??
                generateAvatarUri({ seed: data.user.name, variant: "initials" })
            } />
    )

};
