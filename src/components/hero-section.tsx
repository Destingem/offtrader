"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { HeroAnimation } from "./hero-animation"
import Link from "next/link"
import { useThemeStore } from "@/lib/store"


export function HeroSection() {
  const { theme } = useThemeStore()

  return (
    <div className={`relative min-h-[90vh] overflow-hidden ${theme === "dark" ? "bg-background" : "bg-white"}`}>
      {/* Animation layer */}
      <div className="absolute inset-0 z-0">
        <HeroAnimation />
      </div>

      {/* Content layer */}
      <div className="relative z-10 min-h-[100vh] pt-8 md:pt-8 pl-4 md:pl-8">
        <div className="container">
          <div className="max-w-[640px] flex flex-col items-start gap-4">
            <h1
              className={`text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl ${theme === "dark" ? "text-white" : "text-gray-900"}`}
            >
              Enter The Digital Matrix
              <br className="hidden sm:inline" />
              With OFFTRADER Academy
            </h1>
            <p className={`text-lg sm:text-xl leading-relaxed ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              Unlock the secrets of the digital realm. Master the code, bend reality, and forge your path to
              unprecedented success in the new world order.
            </p>

            <div className="flex gap-4 mt-4">
              <Button
                size="lg"
                className={`${theme === "dark" ? "bg-primary text-primary-foreground" : "bg-black text-white"} hover:bg-primary/90`}
              >
                Jack In
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className={`${theme === "dark" ? "bg-secondary text-secondary-foreground" : "bg-white text-black border border-black"} hover:bg-secondary/80`}
                asChild
              >
                <Link href="https://academy.offtrader.ru">Try Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

