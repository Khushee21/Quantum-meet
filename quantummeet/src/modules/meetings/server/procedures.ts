import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { eq, getTableColumns, and, ilike, desc, count, sql } from "drizzle-orm";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constant";
import { meetingsInsertSchema, meetingUpdateSchema } from "../schema";
import { MeetingStatus } from "../type";

export const meetingsRouter = createTRPCRouter({

    //create
    create: protectedProcedure
        .input(meetingsInsertSchema)
        .mutation(async ({ input, ctx }) => {
            const [createdMeeting] = await db.insert(meetings).values({
                ...input,
                userId: ctx.auth.user.id,
            })
                .returning();

            //create stream call 

            return createdMeeting;
        }),

    //get all meetings
    getMany: protectedProcedure.input(z.object({
        page: z.number().default(DEFAULT_PAGE),
        pageSize: z.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
        search: z.string().nullish(),
        agentId: z.string().nullish(),
        status: z.enum([
            MeetingStatus.Upcoming,
            MeetingStatus.Active,
            MeetingStatus.Cancelled,
            MeetingStatus.Processing,
            MeetingStatus.Completed,
        ]).nullable(),
    })).
        query(async ({ ctx, input }) => {

            const { search, page, pageSize, status, agentId } = input;

            const data = await db
                .select({
                    ...getTableColumns(meetings),
                    agent: agents,
                    duration: sql<number>`EXTRACT(EPOCH FROM (${meetings.endedAt} - ${meetings.startedAt}))`.as("duration"),
                })
                .from(meetings)
                .innerJoin(agents, eq(meetings.agentId, agents.id))
                .where(
                    and(
                        eq(meetings.userId, ctx.auth.user.id),
                        search ? ilike(meetings.name, `%${input.search}%`) : undefined,
                        status ? eq(meetings.status, status) : undefined,
                        agentId ? eq(meetings.agentId, agentId) : undefined,
                    ))

                .orderBy(desc(meetings.createdAt), desc(meetings.id))
                .limit(pageSize)
                .offset((page - 1) * pageSize)

            const [total] = await db.select({
                count: count()
            })
                .from(meetings)
                .innerJoin(agents, eq(meetings.agentId, agents.id))
                .where(
                    and(
                        eq(meetings.userId, ctx.auth.user.id),
                        search ? ilike(meetings.name, `%${input.search}$%`) : undefined,
                        status ? eq(meetings.status, status) : undefined,
                        agentId ? eq(meetings.agentId, agentId) : undefined,));

            const totalPages = Math.ceil(total.count / pageSize);


            return {
                items: data,
                total: total.count,
                totalPages
            };
        }),

    //get one meeting
    getOne: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input, ctx }) => {
            const [existingMeeting] = await db
                .select({
                    ...getTableColumns(meetings),
                    agent: agents,
                    duration: sql<number>`EXTRACT(EPOCH FROM (${meetings.endedAt} - ${meetings.startedAt}))`.as("duration"),
                })
                .from(meetings)
                .innerJoin(agents, eq(meetings.agentId, agents.id))
                .where(
                    and(
                        eq(meetings.id, input.id),
                        eq(meetings.userId, ctx.auth.user.id),

                    )
                );

            if (!existingMeeting) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Meeting not found!" });
            }

            await new Promise((resolve) => setTimeout(resolve, 3000));

            return existingMeeting;
        }),

    //update agent
    update: protectedProcedure
        .input(meetingUpdateSchema)
        .mutation(async ({ ctx, input }) => {
            const [updateMeeting] = await db.
                update(meetings)
                .set(input)
                .where(
                    and(
                        eq(meetings.id, input.id),
                        eq(meetings.userId, ctx.auth.user.id),
                    ),
                )
                .returning();

            if (!updateMeeting) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Meeting not found" })
            }
            return updateMeeting;
        }),

    //remove meeting
    remove: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const [removeMeeting] = await db.
                delete(meetings)
                .where(
                    and(
                        eq(meetings.id, input.id),
                        eq(meetings.userId, ctx.auth.user.id),
                    ),
                )
                .returning();

            if (!removeMeeting) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Meeting not found" })
            }
            return removeMeeting;
        }),
});