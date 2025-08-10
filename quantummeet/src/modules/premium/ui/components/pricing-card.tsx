"use client";

import { CircleCheckIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const pricingCardVariants = cva(
    "relative overflow-hidden rounded-2xl p-6 w-full flex flex-col border shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
    {
        variants: {
            variant: {
                default: "bg-white text-black border-gray-200",
                highlighted:
                    "bg-gradient-to-br from-blue-600 via-blue-500 to-blue-800 text-white border-transparent",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

const pricingCardIconVariants = cva("size-5", {
    variants: {
        variant: {
            default: "fill-primary text-primary",
            highlighted: "fill-white text-blue-200",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});

const pricingCardSecondaryTextVariants = cva("text-neutral-700", {
    variants: {
        variant: {
            default: "text-neutral-600",
            highlighted: "text-blue-100",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});

const pricingCardBadgeVariants = cva(
    "text-xs font-semibold px-3 py-1 rounded-full shadow-sm",
    {
        variants: {
            variant: {
                default: "bg-primary/15 text-primary",
                highlighted: "bg-yellow-300 text-black",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

interface Props extends VariantProps<typeof pricingCardVariants> {
    badge?: string | null;
    price: number;
    features: string[];
    title: string;
    description?: string | null;
    priceSuffix: string;
    className?: string;
    buttonText: string;
    onClick: () => void;
}

export const PricingCard = ({
    variant,
    badge,
    price,
    features,
    title,
    description,
    priceSuffix,
    className,
    buttonText,
    onClick,
}: Props) => {
    return (
        <div
            className={cn(
                pricingCardVariants({ variant }),
                className,
                variant === "highlighted"
                    ? "ring-2 ring-blue-300 h-[440px]"
                    : "hover:ring-1 hover:ring-primary/40 h-[400px]"
            )}
        >
            {/* Glow effect for highlighted variant */}
            {variant === "highlighted" && (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent pointer-events-none rounded-2xl" />
            )}

            <div className="flex items-end gap-x-4 justify-between z-10">
                <div className="flex flex-col gap-y-2">
                    <div className="flex items-center gap-x-2">
                        <h6 className="font-bold text-2xl">{title}</h6>
                        {badge && (
                            <Badge className={cn(pricingCardBadgeVariants({ variant }))}>
                                {badge}
                            </Badge>
                        )}
                    </div>
                    {description && (
                        <p
                            className={cn(
                                "text-sm leading-snug",
                                pricingCardSecondaryTextVariants({ variant })
                            )}
                        >
                            {description}
                        </p>
                    )}
                </div>
                <div className="flex items-baseline gap-1">
                    <h4 className="text-4xl font-extrabold tracking-tight">
                        {Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                            minimumFractionDigits: 0,
                        }).format(price)}
                    </h4>
                    <span
                        className={cn(
                            "text-sm",
                            pricingCardSecondaryTextVariants({ variant })
                        )}
                    >
                        {priceSuffix}
                    </span>
                </div>
            </div>

            <Separator className="my-6 opacity-20" />

            <div className="flex flex-col gap-y-3 mt-2">
                <p className="font-medium uppercase tracking-wide text-sm">
                    What’s Included
                </p>
                <ul
                    className={cn(
                        "flex flex-col gap-y-3",
                        pricingCardSecondaryTextVariants({ variant })
                    )}
                >
                    {features?.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-sm">
                            <CircleCheckIcon
                                className={cn(pricingCardIconVariants({ variant }))}
                            />
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <Button
                onClick={onClick}
                className={cn(
                    "mt-8 w-full transition-all duration-300",
                    variant === "highlighted"
                        ? " text-black bg-white hover:bg-blue-50"
                        : "hover:scale-[1.02]"
                )}
                size="lg"
                variant={variant === "highlighted" ? "default" : "outline"}
            >
                {buttonText}
            </Button>
        </div>
    );
};
