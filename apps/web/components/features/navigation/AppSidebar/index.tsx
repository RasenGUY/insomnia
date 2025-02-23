import { Send, LayoutDashboard } from "lucide-react"
import Image from "next/image"
import Logo from "public/images/logo.svg"

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
import Navbar from "../Navbar"
import Link from "next/link"

const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Send",
    url: "/send",
    icon: Send,
  },
]

export default function AppSidebar({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Sidebar collapsible={"icon"}>
        <SidebarHeader>
          <SidebarGroupLabel asChild className="text-lg mt-4">
            <Image src={Logo} alt="Logo" width={250} height={250} />
          </SidebarGroupLabel>
        </SidebarHeader>
        <SidebarContent className="mt-3">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu >
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <div className="w-full relative"> 
        <Navbar />
        <main className="w-full pt-16">
          {children}
        </main>
    </div>
    </>
  )
}