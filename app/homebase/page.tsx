import { Activity } from "icons"
import Sidebar from "./Sidebar"

const HomebasePage = () => {
  const sidebarItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: "DashboardIcon",
      items: [],
    },
    {
      title: "Health Check",
      url: "/health-check",
      icon: Activity,
      items: [],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: "SettingsIcon",
      items: [],
    },
  ]

  return (
    <div>
      <Sidebar items={sidebarItems} />
      {/* rest of code here */}
    </div>
  )
}

export default HomebasePage
