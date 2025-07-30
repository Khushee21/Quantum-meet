import { AlertCircleIcon } from "lucide-react";

interface Props {
    title: string;
    description: string;
}

export const ErrorState = ({
    title,
    description,
}: Props) => {
    return (
        <div className="py-10 px-6 flex flex-1 items-center justify-center min-h-[300px]">
            <div className="flex flex-col items-center justify-center gap-y-6 rounded-xl p-10 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 shadow-2xl animate-fade-in">
                <AlertCircleIcon className="size-8 animate-spin text-red-500 drop-shadow-md" />
                <div className="flex flex-col gap-y-1 text-center text-white">
                    <h6 className="text-xl font-semibold animate-pulse">{title}</h6>
                    <p className="text-sm text-blue-100">{description}</p>
                </div>
            </div>
        </div>
    );
};
