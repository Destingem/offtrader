import type React from "react"
import { SiteHeader } from "@/components/site-header"
import { Footer } from "@/components/footer"

export default function PolicyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1 container mx-auto py-12">{children}</main>
      <Footer />
    </div>
  )
}

