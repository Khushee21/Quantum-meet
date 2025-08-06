"use client";

import { LogInIcon } from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-cliennt";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { useState, useEffect } from "react";
import { SessionData } from "@/types/AllTypes";

import {
    DefaultVideoPlaceholder,
    StreamVideoParticipant,
    ToggleAudioPreviewButton,
    ToggleVideoPreviewButton,
    useCallStateHooks,
    VideoPreview,
} from "@stream-io/video-react-sdk";
import { generateAvatarUri } from "@/lib/avatar";
import { Button } from "@/components/ui/button";

interface Props {
    onJoin: () => void;
}

export const CallLobby = ({ onJoin }: Props) => {
    const { useCameraState, useMicrophoneState } = useCallStateHooks();

    const { hasBrowserPermission: hasMicPermission } = useMicrophoneState();
    const { hasBrowserPermission: hascameraPermission } = useCameraState();
    const hasBrowserMediaPermission = hascameraPermission && hasMicPermission;
    const [data, setSession] = useState<SessionData | null>(null);

    const DisableVideoPreview = () => {

        useEffect(() => {
            const fetchSession = async () => {
                type AuthResult =
                    | { data: SessionData }
                    | { error: { message: string; code?: string } };

                const result = (await authClient.getSession()) as AuthResult;

                if ("data" in result) {
                    setSession(result.data);
                }
            };

            fetchSession();
        }, []);
        return (
            <DefaultVideoPlaceholder
                participant={
                    {
                        name: data?.user.name ?? "",
                        image:
                            data?.user.image ??
                            generateAvatarUri({
                                seed: data?.user.name ?? "",
                                variant: "initials"
                            })
                    } as StreamVideoParticipant
                } />
        )
    }

    const AllowBrowserPermission = () => {
        return (
            <p className="text-sm">
                Please grant your browser a permission to access your camera and microphone.
            </p>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-radial from-sidebar-accent">
            <div className="flex flex-col items-center justify-center w-full max-w-md p-8 gap-y-6 bg-background rounded-lg shadow-md ">
                <div className="flex flex-col gap-y-2 text-center">
                    <h6 className="text-lg font-medium">Ready to join?</h6>
                    <p className="text-sm">Set up your call before joining</p>
                </div>
                <VideoPreview
                    DisabledVideoPreview={
                        hasBrowserMediaPermission
                            ? DisableVideoPreview
                            : AllowBrowserPermission
                    }
                />
                <div className="flex gap-x-2">
                    <ToggleAudioPreviewButton />
                    <ToggleVideoPreviewButton />
                </div>
                <div className="flex gap-x-2 justify-between w-full">
                    <Button asChild variant="ghost">
                        <Link href="/meetings">
                            Cancel
                        </Link>
                    </Button>
                    <Button
                        onClick={onJoin}>
                        <LogInIcon />
                        Join Call
                    </Button>
                </div>
            </div>
        </div>
    );

};
