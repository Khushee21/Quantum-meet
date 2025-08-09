import { MeetingGetOne } from "../../type";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
    SparklesIcon,
    FileTextIcon,
    BookOpenTextIcon,
    FileVideoIcon,
    ClockFadingIcon,
} from "lucide-react";
import Markdown from "react-markdown";
import { GeneratedAvatar } from "@/components/generate-avatar";
import Link from "next/link";
import format from "date-fns/format";
import { Badge } from "@/components/ui/badge";
import { formatDuration } from "@/lib/utils";
import { Transcript } from "./transcript";
import { ChatProvider } from "./chat-provider";

interface Props {
    data: MeetingGetOne;
}

export const CompletedState = ({ data }: Props) => {
    return (
        <div className="flex flex-col gap-y-6">
            <Tabs defaultValue="summary" className="w-full">
                <div className="bg-white rounded-2xl border px-4 py-3 shadow-md">
                    <ScrollArea>
                        <TabsList className="flex space-x-4 bg-transparent p-2">
                            <TabsTrigger
                                value="summary"
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl hover:bg-gray-100 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 transition"
                            >
                                <BookOpenTextIcon size={18} />
                                Summary
                            </TabsTrigger>

                            <TabsTrigger
                                value="transcript"
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl hover:bg-gray-100 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 transition"
                            >
                                <FileTextIcon size={18} />
                                Transcript
                            </TabsTrigger>

                            <TabsTrigger
                                value="recording"
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl hover:bg-gray-100 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 transition"
                            >
                                <FileVideoIcon size={18} />
                                Recording
                            </TabsTrigger>

                            <TabsTrigger
                                value="chat"
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl hover:bg-gray-100 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 transition"
                            >
                                <SparklesIcon size={18} />
                                Ask AI
                            </TabsTrigger>
                        </TabsList>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </div>

                {/* Summary Tab */}
                <TabsContent value="summary">
                    <div className="bg-white rounded-lg border px-6 py-5 mt-4 shadow-sm">
                        <div className="px-4 py-5 gap-y-5 flex flex-col col-span-5">
                            <h2 className="text-lg font-medium capitalize">{data.name}</h2>
                            <div className="flex gap-x-2 items-center">
                                <Link
                                    href={`/agents/${data.agent.id}`}
                                    className="flex items-center gap-x-2 underline underline-offset-4 capitalize"
                                >
                                    <GeneratedAvatar
                                        seed={data.agent.name}
                                        variant="botttsNeutral"
                                        className="size-5"
                                    />
                                    {data.agent.name}
                                </Link>
                                <p>{data.startedAt ? format(data.startedAt, "PPP") : ""}</p>
                            </div>

                            <div className="flex gap-x-2 items-center">
                                <SparklesIcon className="size-4" />
                                <p>General summary</p>
                            </div>

                            <Badge variant="outline" className="flex items-center gap-x-2 [&>svg]:size-4">
                                <ClockFadingIcon className="text-blue-700" />
                                {data.duration ? formatDuration(data.duration) : "No duration"}
                            </Badge>

                            <div>
                                <Markdown
                                    components={{
                                        h1: (props) => (
                                            <h1 className="text-2xl font-medium mb-6" {...props} />
                                        ),
                                        h2: (props) => (
                                            <h2 className="text-xl font-semibold mb-5" {...props} />
                                        ),
                                        h3: (props) => (
                                            <h3 className="text-lg font-semibold mb-4" {...props} />
                                        ),
                                        h4: (props) => (
                                            <h4 className="text-base font-medium mb-3" {...props} />
                                        ),
                                        p: (props) => (
                                            <p className="mb-6 leading-relaxed" {...props} />
                                        ),
                                        ul: (props) => (
                                            <ul className="list-disc list-inside mb-6" {...props} />
                                        )
                                    }}
                                >
                                    {data.summary}
                                </Markdown>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* Transcript Tab */}
                <TabsContent value="transcript">
                    <Transcript meetingId={data.id} />
                </TabsContent>

                {/* Recording Tab */}
                <TabsContent value="recording">
                    <div className="bg-white rounded-xl border px-6 py-5 mt-4 shadow-sm">
                        <h2 className="text-lg font-semibold mb-2 text-gray-800">Meeting Recording</h2>
                        {data.recordingUrl ? (
                            <video src={data.recordingUrl} className="w-full rounded-xl" controls />
                        ) : (
                            <p className="text-gray-500 italic">No recording available.</p>
                        )}
                    </div>
                </TabsContent>

                {/* Ask AI Tab */}
                <TabsContent value="chat">
                    <ChatProvider meetingId={data.id} meetingName={data.name} />
                </TabsContent>
            </Tabs>
        </div>
    );
};
