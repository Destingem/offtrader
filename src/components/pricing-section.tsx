"use client"

import { useState } from "react"
import { Check, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"

const tiers = [
  {
    name: "Basic",
    price: { monthly: 49, yearly: 470 },
    description: "Essential tools to start your journey",
    features: ["Access to 2 courses", "Basic community access", "Monthly Q&A sessions", "Email support"],
  },
  {
    name: "Pro",
    price: { monthly: 99, yearly: 950 },
    description: "Advanced features for serious entrepreneurs",
    features: [
      "Access to all courses",
      "Priority community access",
      "Weekly live coaching",
      "24/7 email and chat support",
      "Exclusive webinars",
    ],
  },
  {
    name: "Elite",
    price: { monthly: 199, yearly: 1900 },
    description: "Ultimate package for maximum success",
    features: [
      "Access to all courses and future releases",
      "VIP community access",
      "Daily live coaching",
      "24/7 priority support",
      "One-on-one mentorship",
      "Exclusive mastermind group",
    ],
  },
]

const comparisonFeatures = [
  { name: "Number of Courses", basic: "2", pro: "All", elite: "All + Future Releases" },
  { name: "Community Access", basic: "Basic", pro: "Priority", elite: "VIP" },
  { name: "Live Coaching", basic: "Monthly Q&A", pro: "Weekly", elite: "Daily" },
  { name: "Support", basic: "Email", pro: "24/7 Email & Chat", elite: "24/7 Priority" },
  { name: "Exclusive Webinars", basic: "❌", pro: "✅", elite: "✅" },
  { name: "One-on-One Mentorship", basic: "❌", pro: "❌", elite: "✅" },
  { name: "Mastermind Group", basic: "❌", pro: "❌", elite: "✅" },
]

export function PricingSection() {
  const [isYearly, setIsYearly] = useState(true)

  return (
    <section id="pricing" className="container py-24 space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Pricing Plans</h2>
        <p className="mt-4 text-muted-foreground">Choose the perfect plan to accelerate your success</p>
      </div>
      <div className="flex justify-center items-center space-x-4">
        <span className={`text-sm ${isYearly ? "text-primary" : "text-muted-foreground"}`}>
          Yearly (Save up to 20%)
        </span>
        <Switch checked={isYearly} onCheckedChange={setIsYearly} />
        <span className={`text-sm ${!isYearly ? "text-primary" : "text-muted-foreground"}`}>Monthly</span>
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {tiers.map((tier) => (
          <Card key={tier.name} className="flex flex-col">
            <CardHeader>
              <CardTitle>{tier.name}</CardTitle>
              <CardDescription>{tier.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="text-4xl font-bold mb-2">
                ${isYearly ? Math.round(tier.price.yearly / 12) : tier.price.monthly}
                <span className="text-sm font-normal text-muted-foreground">/month</span>
              </div>
              {isYearly && (
                <p className="text-sm text-muted-foreground mb-4">Billed annually at ${tier.price.yearly}/year</p>
              )}
              <ul className="space-y-2 text-sm">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link href="/checkout">Get Started</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <Card className="mt-8">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <h3 className="text-2xl font-semibold">Not sure yet? Try our demo</h3>
            <p className="text-muted-foreground mt-2">
              Experience the power of OFFTRADER Academy firsthand with our interactive demo.
            </p>
          </div>
          <Button size="lg" variant="secondary" className="ml-4" asChild>
            <Link href="https://academy.offtrader.ru">
              Try Demo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* New Comparison Section */}
      <Card className="mt-16">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Plan Comparison</CardTitle>
          <CardDescription className="text-center">Compare features across our different pricing tiers</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Feature</TableHead>
                <TableHead>Basic</TableHead>
                <TableHead>Pro</TableHead>
                <TableHead>Elite</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comparisonFeatures.map((feature) => (
                <TableRow key={feature.name}>
                  <TableCell className="font-medium">{feature.name}</TableCell>
                  <TableCell>{feature.basic}</TableCell>
                  <TableCell>{feature.pro}</TableCell>
                  <TableCell>{feature.elite}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  )
}

