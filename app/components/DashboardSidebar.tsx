import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useSession } from "@/lib/auth-client";
import { Plus } from "lucide-react"



const menuItemsByRole = {
    seeker: [
        
    ],

    recruiter: [],

    admin: [],
}


export function DashboardSidebar() {


      const { data: session, isPending, refetch } = useSession();

      const userName = session?.user.name || "User";
      const userEmail = session?.user.email || "";
      const userRole = session?.user.role || "seeker";



    return (
        <Sidebar>
            <SidebarHeader />
            <SidebarContent>
                <SidebarGroup />
                <SidebarGroup />
                <SidebarGroup>
                    <SidebarMenu>
  {
  menuItemsByRole[userRole]?.map((item) => (
    <SidebarMenuItem key={item.name}>
      <SidebarMenuButton render={<a href={item.url} />}>
        <item.icon />
        <span>{item.name}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  ))
  }
</SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}