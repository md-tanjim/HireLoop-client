import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardSidebar } from "../components/DashboardSidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex min-h-screen w-full mx-auto max-w-[1850px] mt-1">
            <SidebarProvider>
                <DashboardSidebar  />
                <main  className="w-full mx-auto" >
                    <SidebarTrigger />
                    <div className="">
                        {children}
                    </div>
                </main>
            </SidebarProvider>

        </div>
    );
};

export default DashboardLayout;