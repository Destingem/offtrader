"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Menu } from "lucide-react"
import Link from "next/link"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { usePathname } from "next/navigation"
import { useThemeStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

function ThemeToggle() {
  const { theme, setTheme } = useThemeStore()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-9 px-0"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const { theme } = useThemeStore()
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  const isLoggedIn = Boolean(user)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const headerBg = isScrolled
    ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    : "bg-transparent"

  const textColor =
    isScrolled || pathname !== "/" ? "text-foreground" : theme === "dark" ? "text-gray-100" : "text-gray-900"

  const buttonVariant = isScrolled || pathname !== "/" ? "default" : "secondary"

  const navItems = [
    { name: "Features", id: "features" },
    { name: "Courses", id: "courses" },
    { name: "Process", id: "process" },
    { name: "Pricing", id: "pricing" },
    { name: "Reviews", id: "reviews" },
    { name: "FAQ", id: "faq" },
  ]

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  return (
    <header className={`sticky top-0 z-50 w-full transition-colors duration-300 ${headerBg}`}>
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className={`font-bold text-2xl ${textColor}`}>OFFTRADER</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (pathname === "/") {
                  document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" })
                } else {
                  router.push(`/#${item.id}`)
                }
              }}
              className={`text-sm font-medium transition-colors hover:text-primary ${textColor}`}
            >
              {item.name}
            </button>
          ))}
        </nav>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          {isLoggedIn ? (
            <>
              <Button variant={buttonVariant} asChild className="hidden md:inline-flex">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button variant={buttonVariant} className="hidden md:inline-flex" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant={buttonVariant} asChild className="hidden md:inline-flex">
                <Link href="/login">Login</Link>
              </Button>
              <Button variant={buttonVariant} asChild className="hidden md:inline-flex">
                <Link href="/register">Register</Link>
              </Button>
              <Button variant={buttonVariant} asChild className="hidden md:inline-flex">
                <Link href="/checkout">Get Started</Link>
              </Button>
            </>
          )}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (pathname === "/") {
                        document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" })
                      } else {
                        router.push(`/#${item.id}`)
                      }
                      setIsOpen(false)
                    }}
                    className="text-sm font-medium transition-colors hover:text-primary"
                  >
                    {item.name}
                  </button>
                ))}
                {isLoggedIn ? (
                  <>
                    <Button variant={buttonVariant} asChild className="w-full" onClick={() => setIsOpen(false)}>
                      <Link href="/dashboard">Dashboard</Link>
                    </Button>
                    <Button variant={buttonVariant} className="w-full" onClick={() => { setIsOpen(false); handleLogout() }}>
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant={buttonVariant} asChild className="w-full" onClick={() => setIsOpen(false)}>
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button variant={buttonVariant} asChild className="w-full" onClick={() => setIsOpen(false)}>
                      <Link href="/register">Register</Link>
                    </Button>
                    <Button variant={buttonVariant} asChild className="w-full" onClick={() => setIsOpen(false)}>
                      <Link href="/checkout">Get Started</Link>
                    </Button>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}