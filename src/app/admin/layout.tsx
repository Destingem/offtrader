import type { ReactNode } from "react"
import { SiteHeader } from "@/components/site-header"

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1 container mx-auto py-8">{children}</main>
    </div>
  )
}

