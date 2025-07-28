"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { authClient } from "@/lib/auth-cliennt";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { OctagonAlertIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const formSchema = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    email: z.string().email(),
    password: z.string().min(1, { message: 'Password is required' }),
    confirmPassword: z.string().min(1, { message: 'Password is required' }),

})
    .refine((data) => data.password === data.confirmPassword, {
        message: "Password's don't match",
        path: ["confirmPassword"],
    });

export const SignUpView = () => {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        setError(null);
        setLoading(true);

        authClient.signUp.email(
            {
                name: data.name,
                email: data.email,
                password: data.password,
                callbackURL: "/",
            },
            {
                onSuccess: () => router.push("/"),
                onError: (error: any) => setError(error.error.message),
            }
        ).finally(() => setLoading(false));
    };

    const onSocial = (provider: "github" | "google") => {
        setError(null);
        setLoading(true);

        const result = authClient.signIn.social(
            {
                provider: provider,
                callbackURL: "/",
            },
            {
                onSuccess: () => router.push("/"),
                onError: (error: any) => setError(error.error.message),
            }
        ).finally(() => setLoading(false));
        console.log("Social login result:", result);
    };

    return (
        <div className="flex flex-col gap-6">
            <Card className="overflow-hidden p-0">
                <CardContent className="grid grid-cols-1 md:grid-cols-2 p-0">
                    {/* LEFT SIDE: FORM */}
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
                            <div className="flex flex-col gap-6">
                                <div className="text-center">
                                    <h1 className="text-2xl font-bold text-blue-700">Let's get started</h1>
                                    <p className="text-muted-foreground">Create your account</p>
                                </div>
                                <div className="grid gap-3">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="text"
                                                        placeholder="Annie Wom"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="email"
                                                        placeholder="quantummeet@gmail.com"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        placeholder="********"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Confirm Password</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        placeholder="********"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {!!error && (
                                    <Alert className="bg-destructive/10 border-none">
                                        <OctagonAlertIcon className="h-4 w-4 !text-destructive" />
                                        <AlertTitle>{error}</AlertTitle>
                                    </Alert>
                                )}
                                <Button disabled={loading} type="submit" className="w-full">
                                    {loading ? "Signing in..." : "Sign in"}
                                </Button>


                                <div className="relative text-center text-sm">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-muted" />
                                    </div>
                                    <span className="bg-white px-2 relative z-10 text-muted-foreground">
                                        Or continue with
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <Button disabled={loading}
                                        onClick={() => onSocial("google")}
                                        variant="outline"
                                        type="button"
                                        className="w-full">
                                        <div className="text-blue-700 ">
                                            <FaGoogle />
                                        </div>
                                    </Button>
                                    <Button
                                        disabled={loading}
                                        onClick={() => onSocial("github")}
                                        variant="outline"
                                        type="button"
                                        className="w-full">
                                        <div className="text-blue-700 ">
                                            <FaGithub />
                                        </div>
                                    </Button>
                                </div>

                                <div className="text-center text-sm">
                                    Already have an account?{" "}
                                    <Link
                                        href="/sign-in"
                                        className="underline underline-offset-4"
                                    >
                                        Sign In
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </Form>

                    {/* RIGHT SIDE: LOGO + TEXT */}
                    <div className="bg-blue-800 flex flex-col items-center justify-center text-center p-6">
                        <img
                            src="/logo.png"
                            alt="Quantum Meet Logo"
                            className="w-50 h-50 mb-2"
                        />
                        <p className="text-2xl font-semibold text-white mt-[-10px]">
                            Quantum Meet
                        </p>
                    </div>
                </CardContent>
            </Card>

            <div className="text-muted-foreground text-center text-xs">
                By clicking continue, you agree to our{" "}
                <a href="#" className="underline underline-offset-4 hover:text-primary">
                    Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="underline underline-offset-4 hover:text-primary">
                    Privacy Policy
                </a>
                .
            </div>
        </div>
    );
};
