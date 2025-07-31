import { db } from "@/db";
import { agents } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { agentsInsertSchema } from "../ui/schema";
import { z } from "zod";
import { eq, getTableColumns, sql } from "drizzle-orm";

export const agentsRouter = createTRPCRouter({
    getMany: protectedProcedure.query(async () => {
        const data = await db
            .select({
                meetingCount: sql<number>`5`,
                ...getTableColumns(agents),
            })
            .from(agents);

        await new Promise((resolve) => setTimeout(resolve, 3000));
        //throw new TRPCError({ code: "BAD_REQUEST" });

        return data;
    }),

    getOne: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input }) => {
            const [agent] = await db
                .select()
                .from(agents)
                .where(eq(agents.id, input.id));

            if (!agent) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Agent not found" });
            }

            await new Promise((resolve) => setTimeout(resolve, 3000));

            return agent;
        }),

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