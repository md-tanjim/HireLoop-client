import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardSidebar } from "../components/DashboardSidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <SidebarProvider>
                <DashboardSidebar />
                <main>
                    <SidebarTrigger />
                    <div>
                        {children}
                    </div>
                </main>
            </SidebarProvider>

        </div>
    );
};

export default DashboardLayout;