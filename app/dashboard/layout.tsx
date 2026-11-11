import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardSidebar } from "../components/DashboardSidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex min-h-screen w-full mx-auto max-w-[1450px] mt-10">
            <SidebarProvider>
                <DashboardSidebar  />
                <main>
                    <SidebarTrigger />
                    <div className="w-full ">
                        {children}
                    </div>
                </main>
            </SidebarProvider>

        </div>
    );
};

export default DashboardLayout;