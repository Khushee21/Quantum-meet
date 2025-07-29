import { SidebarProvider } from "@/components/ui/sidebar";
import { DashBoardSidebar } from "@/modules/dashboard/ui/components/dashboard-sidebar";
import { DashboardNavbar } from "@/modules/dashboard/ui/components/dashboard-navbar";
DashBoardSidebar
interface Props {
    children: React.ReactNode;
}

const layout = ({ children }: Props) => {
    return (
        <SidebarProvider>
            <div className="flex h-screen w-full">
                <DashBoardSidebar />
                <main className="flex flex-col w-full">
                    <DashboardNavbar />
                    <div className="flex-1 overflow-y-auto">
                        {children}
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
};


export default layout;