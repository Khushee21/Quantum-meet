import { db } from "@/db";
import { agents } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { agentsInsertSchema, agentsUpdateSchema } from "../ui/schema";
import { z } from "zod";
import { eq, getTableColumns, sql, and, ilike, desc, count } from "drizzle-orm";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constant";

export const agentsRouter = createTRPCRouter({

    //update agent
    update: protectedProcedure
        .input(agentsUpdateSchema)
        .mutation(async ({ ctx, input }) => {
            const [updateAgent] = await db.
                update(agents)
                .set(input)
                .where(
                    and(
                        eq(agents.id, input.id),
                        eq(agents.userId, ctx.auth.user.id),
                    ),
                )
                .returning();

            if (!updateAgent) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Agent not found" })
            }
            return updateAgent;
        }),


    //remove agent
    remove: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const [removeAgnet] = await db
                .delete(agents)
                .where(
                    and(
                        eq(agents.id, input.id),
                        eq(agents.userId, ctx.auth.user.id),
                    ),
                ).returning();

            if (!removeAgnet) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Agent not found" })
            }
            return removeAgnet;
        }),

    //get all agents
    getMany: protectedProcedure.input(z.object({
        page: z.number().default(DEFAULT_PAGE),
        pageSize: z.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
        search: z.string().nullish()
    })).
        query(async ({ ctx, input }) => {

            const { search, page, pageSize } = input;
            const data = await db
                .select({
                    meetingCount: sql<number>`5`,
                    ...getTableColumns(agents),
                })
                .from(agents)
                .where(
                    and(
                        eq(agents.userId, ctx.auth.user.id),
                        search ? ilike(agents.name, `%${input.search}$%`) : undefined))
                .orderBy(desc(agents.createdAt), desc(agents.id))
                .limit(pageSize)
                .offset((page - 1) * pageSize)

            const [total] = await db.select({
                count: count()
            })
                .from(agents)
                .where(
                    and(
                        eq(agents.userId, ctx.auth.user.id),
                        search ? ilike(agents.name, `%${input.search}$%`) : undefined));

            const totalPages = Math.ceil(total.count / pageSize);


            return {
                items: data,
                total: total.count,
                totalPages
            };
        }),

    //get one agents
    getOne: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input, ctx }) => {
            const [existingAgent] = await db
                .select({
                    meetingCount: sql<number>`5`,
                    ...getTableColumns(agents),
                })
                .from(agents)
                .where(
                    and(
                        eq(agents.id, input.id),
                        eq(agents.userId, ctx.auth.user.id),

                    )
                );

            if (!existingAgent) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Agent not found!" });
            }

            await new Promise((resolve) => setTimeout(resolve, 3000));

            return existingAgent;
        }),

    //create new agents
    create: protectedProcedure
        .input(agentsInsertSchema)
        .mutation(async ({ input, ctx }) => {
            const [createdAgent] = await db.insert(agents).values({
                ...input,
                userId: ctx.auth.user.id,
            })
                .returning();
            return createdAgent;
        }),
});