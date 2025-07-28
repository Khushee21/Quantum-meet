"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-cliennt";
import { SessionData } from "@/types/AllTypes";
import { useRouter } from "next/router";

const HomeView = () => {
    const [session, setSession] = useState<SessionData | null>(null);
    const router = useRouter()

    useEffect(() => {
        const fetchSession = async () => {
            const result = await authClient.getSession() as
                | { data: SessionData }
                | { error: any };

            if ("data" in result) {
                setSession(result.data);
            }
        };
        fetchSession();
    }, []);

    const handleSignOut = async () => {
        await authClient.signOut({}, {
            onSuccess: async () => {
                await router.push("/sign-in");
            },
            onError: (error: any) => {
                console.error("Sign out failed", error);
            }
        });

        setSession(null);
    };


    if (!session) {
        return (
            <p>loading.....</p>
        )
    }

    return (
        <div className="flex flex-col p-4 gap-y-4">
            {session ? (
                <>
                    <p>Logged in as {session.user.name}</p>
                    <Button onClick={handleSignOut}>Sign out</Button>
                </>
            ) : (
                <p>You are not logged in.</p>
            )}
        </div>
    );
};

export default HomeView;
