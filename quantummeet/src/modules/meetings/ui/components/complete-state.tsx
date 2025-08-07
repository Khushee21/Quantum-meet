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

                <TabsContent value="summary">
                    <div className="bg-white rounded-lg border px-6 py-5 mt-4 shadow-sm">
                        <div className="px-4 py-5 gap-y-5 flex flex-col col-span-5">
                            <h2 className="text-lg font-medium capitalize">{data.name}</h2>
                            <div className="flex gap-x-2 items-center">
                                <Link href={`/agents/${data.agent.id}`}
                                    className="flex items-center gap-x-2 underline underline-offset-4 capitalize">
                                    <GeneratedAvatar
                                        seed={data.agent.name}
                                        variant="botttsNeutral"
                                        className="size-5"
                                    />
                                    {data.agent.name}
                                </Link>{" "}
                                <p>{data.startedAt ? format(data.startedAt, "PPP") : ""}</p>
                            </div>
                            <div className="flex gap-x-2 items-center">
                                <SparklesIcon className="size-4" />
                                <p>General summary</p>
                            </div>
                            <Badge
                                variant="outline"
                                className="flex items-center gap--x-2 [&>svg]:size-4">
                                <ClockFadingIcon />
                            </Badge>
                            {/* <p className="text-gray-600">{data.summary || "No summary available."}</p> */}
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="transcript">
                    <div className="bg-white rounded-xl border px-6 py-5 mt-4 shadow-sm">
                        <h2 className="text-lg font-semibold mb-2 text-gray-800">Transcript</h2>
                        {/* Render transcript content here */}
                        <p className="text-gray-500 italic">Transcript data not implemented.</p>
                    </div>
                </TabsContent>

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

                <TabsContent value="chat">
                    <div className="bg-white rounded-xl border px-6 py-5 mt-4 shadow-sm">
                        <h2 className="text-lg font-semibold mb-2 text-gray-800">Ask AI</h2>
                        <p className="text-gray-600">Ask AI feature coming soon...</p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};
