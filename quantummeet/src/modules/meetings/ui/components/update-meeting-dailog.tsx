import { ResponsiveDialog } from "@/components/responsive-dialog";
import { MeetingForm } from "./meeting-form";
import { MeetingGetOne } from "../../type";

interface NewMeetingDailogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialValue: MeetingGetOne
};

export const UpdateMeetingDailog = ({
    open,
    onOpenChange,
    initialValue
}: NewMeetingDailogProps) => {
    return (
        <ResponsiveDialog
            title="Edit Meeting"
            description="Edit the meeting details"
            open={open}
            onOpenChange={onOpenChange}>
            <MeetingForm
                onSuccess={() => onOpenChange(false)}
                onCancel={() => onOpenChange(false)}
                initialValue={initialValue} />
        </ResponsiveDialog>
    )
}