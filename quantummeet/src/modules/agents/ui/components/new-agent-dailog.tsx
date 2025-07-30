import { ResponsiveDialog } from "@/components/responsive-dailog";

interface NewAgentDailogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void
};

export const NewAgentDailog = ({ open, onOpenChange }: NewAgentDailogProps) => {
    return (
        <ResponsiveDialog
            title="New Agent"
            description="Create a new agent"
            open={open}
            onOpenChange={onOpenChange}>
            new Agent form
        </ResponsiveDialog>
    )
}