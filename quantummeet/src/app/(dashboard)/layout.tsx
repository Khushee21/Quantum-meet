import { SidebarProvider } from "@/components/ui/sidebar";
import { DashBoardSidebar } from "@/modules/dashboard/ui/components/dashboard-sidebar";
DashBoardSidebar
interface Props {
    children: React.ReactNode;
}

const layout = ({ children }: Props) => {
    return (
        <SidebarProvider >
            <DashBoardSidebar />
            <main className="flex flex-col h-screen">
                {children}
            </main>
        </SidebarProvider>
    );
};

export default layout;