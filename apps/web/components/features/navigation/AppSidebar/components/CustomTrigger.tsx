import { useSidebar } from "@workspace/ui/components/sidebar"

export function CustomTrigger() {
  const { toggleSidebar } = useSidebar()
  return <button onClick={toggleSidebar}>Toggle Sidebar</button>
}
