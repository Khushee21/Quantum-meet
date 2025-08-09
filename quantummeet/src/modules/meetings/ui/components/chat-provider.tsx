"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-cliennt";
import { LoadingState } from "@/components/loading-state";
import { ChatUI } from "./chat-ui";

interface SessionData {
    user: {
        id: string;
        name: string;
        image?: string | null;
    };
}

interface Props {
    meetingId: string;
    meetingName: string;
}

export const ChatProvider = ({ meetingId, meetingName }: Props) => {
    const [data, setSession] = useState<SessionData | null>(null);
    const [isPending, setIsPending] = useState(true);

    useEffect(() => {
        const fetchSession = async () => {
            setIsPending(true);
            type AuthResult =
                | { data: SessionData }
                | { error: { message: string; code?: string } };

            const result = (await authClient.getSession()) as AuthResult;

            if ("data" in result) {
                setSession(result.data);
            }
            setIsPending(false);
        };

        fetchSession();
    }, []);

    if (isPending || !data?.user) {
        return (
            <LoadingState
                title="Loading"
                description="Please wait while we load the chat"
            />
        );
    }

    return (
        <ChatUI
            meetingId={meetingId}
            meetingName={meetingName}
            userId={data.user.id}
            username={data.user.name}
            userImage={data.user.image ?? ""}
        />
    );
};
