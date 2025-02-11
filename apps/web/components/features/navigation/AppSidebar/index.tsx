import { Coins, Image } from "lucide-react"
import { useSidebar } from "@workspace/ui/components/sidebar"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@workspace/ui/components/sidebar"

// Menu items.
const items = [
  {
    title: "Tokens",
    url: "#",
    icon: Coins,
  },
  {
    title: "Nfts",
    url: "#",
    icon: Image,
  },
]

export default function AppSidebar() {
  return (
              
    <Sidebar collapsible={"icon"}>
      <SidebarHeader>
        <SidebarGroupLabel asChild className="text-lg mt-4">
          <span>Insomnia</span>         
        </SidebarGroupLabel>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu >
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
