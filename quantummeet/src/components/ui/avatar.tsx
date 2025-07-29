import * as React from "react";
import { cn } from "@/lib/utils";

export function Avatar({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "relative flex h-9 w-9 shrink-0 overflow-hidden rounded-full bg-muted",
                className
            )}
            {...props}
        />
    );
}

export function AvatarImage({
    className,
    src,
    alt,
    ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {

    if (!src) return null;
    return (
        <img
            className={cn("aspect-square h-full w-full", className)}
            src={src}
            alt={alt}
            {...props}
        />
    );
}

export function AvatarFallback({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
    return (
        <span
            className={cn(
                "flex h-full w-full items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground",
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
}
