import { db } from "@/db";
import { agents, meetings, user } from "@/db/schema";
import { inngest } from "@/inngest/client";
import { StreamTranscriptItem } from "@/modules/meetings/type";
import { eq, inArray } from "drizzle-orm";
import { createAgent, openai, TextMessage } from "@inngest/agent-kit";
import JSONL from "jsonl-parse-stringify";

const summerizer = createAgent({
    name: "summerizer",
    system: `You are an expert summarizer. You write readable, concise, simple content. You are given a transcript of a meeting and you need to summarize it.

Use the following markdown structure for every output:

### Overview
Provide a detailed, engaging summary of the session's content. Focus on major features, user workflows, and any key takeaways. Write in a narrative style, using full sentences. Highlight unique or powerful aspects of the product, platform, or discussion.

### Notes
Break down key content into thematic sections with timestamp ranges. Each section should summarize key points, actions, or demos in bullet format.

Example:
#### Section Name
- Main point or demo shown here
- Another key insight or interaction
- Follow-up tool or explanation provided

#### Next Section
- Feature X automatically does Y
- Mention of integration with Z`.trim(),
    model: openai({
        model: "gpt-4o", apiKey: process.env.OPEN_API_KEY
    }),
});

export const meetingsProcessing = inngest.createFunction(
    { id: "meetings/processing" },
    { event: "meetings/processing" },

    async ({ event, step }) => {

        if (!event.data || typeof event.data.transcriptUrl !== "string") {
            throw new Error("Missing or invalid transcriptUrl in event data");
        }

        const response = await step.run("fetch-transcript", async () => {
            return fetch(event.data.transcriptUrl).then((res) => res.text());
        });

        const transcript = await step.run("parse-transcript", async () => {
            return JSONL.parse<StreamTranscriptItem>(response);
        });

        const transcriptWithSpeakers = await step.run("add-speakers", async () => {
            const speakerIds = [
                ...new Set(transcript.map((item: StreamTranscriptItem) => item.speaker_id))
            ];

            const userSpeakers = await db
                .select()
                .from(user)
                .where(inArray(user.id, speakerIds))

            const agentSpeakers = await db
                .select()
                .from(agents)
                .where(inArray(agents.id, speakerIds))


            const speakers = [...userSpeakers, ...agentSpeakers];
            return transcript.map((item) => {
                const speaker = speakers.find(
                    (speaker) => speaker.id === item.speaker_id
                );

                if (!speaker) {
                    return {
                        ...item,
                        user: {
                            name: "unknown",
                        },
                    };
                }

                return {
                    ...item,
                    user: {
                        name: speaker.name,
                    }
                }
            })
        });
        const { output } = await summerizer.run(
            "Summerize the following transcript :" +
            JSON.stringify(transcriptWithSpeakers)
        );

        await step.run("save-summary", async () => {
            await db.update(meetings)
                .set({
                    summary: (output[0] as TextMessage).content as string,
                    status: "completed",
                })
                .where(eq(meetings.id, event.data.meetingId))
        })
        return { success: true };
    }
);
