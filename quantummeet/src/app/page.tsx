"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-cliennt";
import { SessionUser, SessionData } from "@/types/AllTypes";


export default function Home() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [session, setSession] = useState<SessionData | null>(null);

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


  const onSubmit = () => {
    authClient.signUp.email({
      email,
      name,
      password,
    }, {
      onError: () => {
        window.alert("Something went wrong!");
      },
      onSuccess: () => {
        window.alert("Sign up successfully");
      }
    })
  }

  const onLogin = () => {
    authClient.signIn.email({
      email,
      password,
    }, {
      onError: () => {
        window.alert("Something went wrong!");
      },
      onSuccess: () => {
        window.alert("Sign up successfully");
      }
    })
  }
  if (session) {
    return (
      <div>
        <p>Logged in as {session.user.name}</p>
        <Button onClick={() => {
          authClient.signOut();
          setSession(null);
        }
        }
        >
          Sign out
        </Button>

      </div>
    )
  }
  return (
    <div>
      <div className="p-3 flex flex-col gap-y-4">
        <Input
          placeholder="name"
          value={name} onChange={(e) =>
            setName(e.target.value)} />
        <Input
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} />
        <Input
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} />
        <Button onClick={onSubmit}>submit</Button>
      </div>
      <div className="p-3 flex flex-col gap-y-4">
        <Input
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} />
        <Input
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} />
        <Button onClick={onLogin}>submit</Button>
      </div>
    </div>
  );
}
