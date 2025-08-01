import { ReactNode, useState } from "react";
import { ChevronsUpDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandItem,
    CommandResponsiveDialog,
} from "@/components/ui/command";

interface Props {
    options: Array<{
        id: string;
        value: string;
        children: ReactNode;
    }>;
    onSelect: (value: string) => void;
    onSearch?: (value: string) => void;
    value: string;
    placeholder?: string;
    isSearchable?: boolean;
    className?: string;
}

export const CommonSelect = ({
    options,
    onSelect,
    onSearch,
    value,
    placeholder = "Select an option",
    isSearchable = true,
    className,
}: Props) => {
    const [open, setOpen] = useState(false);
    const selectedOption = options.find((option) => option.value === value);

    return (
        <>
            <Button
                type="button"
                variant="outline"
                className={cn(
                    "h-9 w-full justify-between px-2",
                    !selectedOption && "text-muted-foreground",
                    className
                )}
                onClick={() => setOpen(true)}
            >
                <span>{selectedOption?.children ?? placeholder}</span>
                <ChevronsUpDownIcon className="ml-2 h-4 w-4 opacity-50" />
            </Button>

            <CommandResponsiveDialog
                open={open}
                onOpenChange={setOpen}

            >
                <Command>
                    {isSearchable && (
                        <CommandInput
                            placeholder="Search..."
                            onValueChange={(value) => onSearch?.(value)}
                        />
                    )}
                    <CommandList>
                        <CommandEmpty>
                            <span className="text-muted-foreground text-sm">
                                No options found
                            </span>
                        </CommandEmpty>
                        {options.map((option) => (
                            <CommandItem
                                key={option.id}
                                onSelect={() => {
                                    onSelect(option.value);
                                    setOpen(false);
                                }}
                            >
                                {option.children}
                            </CommandItem>
                        ))}
                    </CommandList>
                </Command>
            </CommandResponsiveDialog>
        </>
    );
};
