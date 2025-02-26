'use client'
import { Send, LayoutDashboard } from "lucide-react"
import Image from "next/image"
import Logo from "public/images/logo.svg"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@workspace/ui/components/sidebar"
import Navbar from "../Navbar"
import Link from "next/link"
import BlockiesAvatar from "blockies-react-svg"
import { useAccount } from "wagmi"
import { trpc } from "@/server/client"

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
  const { address } = useAccount()
  const sidebarState = useSidebar()
  const { data: profile } = trpc.resolver.reverse.useQuery(
    { address: address as string },
    {
      enabled: !!address,
    }
  )
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
        {
          profile && sidebarState.state === 'expanded' && (
            <SidebarFooter>
            <SidebarGroup className="flex items-center gap-2">
                 {
                  sidebarState.state === 'expanded' &&
                  <BlockiesAvatar 
                    address={profile.username}
                    scale={25}
                    size={3}  
                    className="rounded-full overflow-hidden border-[.25rem] border-primary shadow-lg"  
                  />
                 }
              <SidebarContent className="flex items-center gap-2 text-sm">
                {profile.username}
              </SidebarContent>
            </SidebarGroup>
          </SidebarFooter>  
          )
        }
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