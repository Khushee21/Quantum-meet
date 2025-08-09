import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import type { Channel as StreamChannel } from "stream-chat"; // ✅ correct import
import {
    useCreateChatClient,
    Chat,
    Channel,
    MessageInput,
    MessageList,
    Thread,
    Window
} from "stream-chat-react";
import { useTRPC } from "@/trpc/client";
import { LoadingState } from "@/components/loading-state";
import "stream-chat-react/dist/css/v2/index.css";

interface Props {
    meetingId: string;
    meetingName: string;
    userId: string;
    username: string;
    userImage: string | undefined;
}

export const ChatUI = ({
    meetingId,
    meetingName,
    userId,
    userImage,
    username
}: Props) => {
    const trpc = useTRPC();
    const { mutateAsync: generateChatToken } = useMutation(
        trpc.meetings.generateChatToken.mutationOptions()
    );

    const [channel, setChannel] = useState<StreamChannel>();
    const client = useCreateChatClient({
        apiKey: process.env.NEXT_PUBLIC_STREAM_CHAT_API_KEY!,
        tokenOrProvider: generateChatToken,
        userData: {
            id: userId,
            name: username,
            image: userImage
        }
    });

    useEffect(() => {
        if (!client) return;

        const newChannel = client.channel("messaging", meetingId, {
            members: [userId]
        });

        setChannel(newChannel);
    }, [client, meetingId, meetingName, userId]);

    if (!client || !channel) {
        return (
            <LoadingState
                title="Loading Chat"
                description="Please wait while we set up your chat"
            />
        );
    }

    return (
        <div className="bg-white rounded-lg border overflow-hidden">
            <Chat client={client}>
                <Channel channel={channel}>
                    <Window>
                        <MessageList />
                        <MessageInput />
                    </Window>
                    <Thread />
                </Channel>
            </Chat>
        </div>
    );
};
