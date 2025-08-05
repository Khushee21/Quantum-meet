"use client";

import {
    Call,
    CallingState,
    StreamCall,
    StreamVideo,
    StreamVideoClient,
} from "@stream-io/video-react-sdk";
import { LoaderIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useTRPC } from "@/trpc/client";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { useMutation } from "@tanstack/react-query";
import { CallUI } from "./call-ui";

interface Props {
    meetingId: string;
    meetingName: string;
    userId: string;
    userName: string;
    userImage: string;
}

export const CallConnect = ({
    meetingId,
    meetingName,
    userId,
    userImage,
    userName,
}: Props) => {
    const trpc = useTRPC();
    const { mutateAsync: generateToken } = useMutation(
        trpc.meetings.generateToken.mutationOptions(),
    );

    const [client, setClient] = useState<StreamVideoClient>();
    const [call, setCall] = useState<Call>();

    // Initialize the Stream client
    useEffect(() => {
        const client = new StreamVideoClient({
            apiKey: process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY!,
            user: {
                id: userId,
                name: userName,
                image: userImage,
            },
            tokenProvider: generateToken,
        });

        setClient(client);

        return () => {
            client?.disconnectUser();
            setClient(undefined);
        };
    }, [userId, userImage, userName, generateToken]);

    // Join or create the call
    useEffect(() => {
        if (!client) return;

        const initCall = async () => {
            const _call = client.call("default", meetingId);

            // No 'members' argument — just get or create the call
            await _call.getOrCreate();

            _call.camera.disable();
            _call.microphone.disable();
            setCall(_call);
        };

        initCall();

        return () => {
            if (call && call.state.callingState !== CallingState.LEFT) {
                call.leave();
                call.endCall();
                setCall(undefined);
            }
        };
    }, [client, meetingId]);

    if (!client || !call) {
        return (
            <div className="flex h-screen items-center justify-center bg-radial from-sidebar-accent">
                <LoaderIcon className="size-8 animate-spin text-white" />
            </div>
        );
    }

    return (
        <StreamVideo client={client}>
            <StreamCall call={call}>
                <CallUI meetingName={meetingName} />
            </StreamCall>
        </StreamVideo>
    );
};
