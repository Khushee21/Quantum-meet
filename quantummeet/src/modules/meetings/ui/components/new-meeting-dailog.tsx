
import { MeetingForm } from "./meeting-form";
import { useRouter } from "next/navigation";
import { ResponsiveDialog } from "@/components/responsive-dialog";


interface NewMeetingDailogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void
};

export const NewMeetingDailog = ({ open, onOpenChange }: NewMeetingDailogProps) => {

    const router = useRouter();
    return (
        <ResponsiveDialog
            title="New Meeting"
            description="Create a new meeting"
            open={open}
            onOpenChange={onOpenChange}>
            <MeetingForm
                onSuccess={(id) => {
                    onOpenChange(false);
                    router.push(`/meetings/${id}`)
                }}
                onCancel={() => onOpenChange(false)}
            />
        </ResponsiveDialog>
    )
}