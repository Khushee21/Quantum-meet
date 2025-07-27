"use client"

import {
  useState, useEffect

} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-cliennt";

type SessionUser = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  image?: string | null;
};

type SessionData = {
  user: SessionUser;
  session: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    expiresAt: Date;
    token: string;
    ipAddress?: string;
    userAgent?: string;
  };
};

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
  if (session) {
    return (
      <div>
        <p>Logged in as {session.user.name}</p>
        <Button onClick={() => authClient.signOut()}>
          Sign out
        </Button>

      </div>
    )
  }
  return (
    <div className="p-120 flex flex-col gap-y-4">
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
  );
}
