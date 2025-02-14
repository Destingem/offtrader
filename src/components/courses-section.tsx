import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bitcoin, ShoppingBag, Globe, TrendingUp, Users, Laptop } from "lucide-react"

const courses = [
  {
    title: "Crypto Trading Mastery",
    description:
      "Master cryptocurrency trading strategies, technical analysis, and portfolio management. Learn to identify profitable opportunities in the crypto market.",
    icon: Bitcoin,
    highlights: [
      "Technical Analysis Fundamentals",
      "Risk Management Strategies",
      "Market Psychology",
      "Portfolio Optimization",
    ],
  },
  {
    title: "Advanced Dropshipping",
    description:
      "Build a successful dropshipping business from scratch. Learn product selection, supplier relations, and scaling strategies.",
    icon: ShoppingBag,
    highlights: ["Product Research Methods", "Supplier Negotiations", "Marketing Strategies", "Automation Systems"],
  },
  {
    title: "E-commerce Empire",
    description:
      "Create and scale your own e-commerce brand. Master digital marketing, customer service, and inventory management.",
    icon: Globe,
    highlights: ["Brand Development", "Customer Acquisition", "Operations Management", "Growth Strategies"],
  },
  {
    title: "Stock Market Strategies",
    description:
      "Learn proven stock market trading techniques, fundamental analysis, and long-term investment strategies.",
    icon: TrendingUp,
    highlights: ["Market Analysis", "Investment Planning", "Risk Assessment", "Portfolio Management"],
  },
  {
    title: "Social Media Marketing",
    description: "Master social media platforms to build your personal brand and generate leads for your business.",
    icon: Users,
    highlights: ["Content Strategy", "Audience Growth", "Monetization Methods", "Analytics & Optimization"],
  },
  {
    title: "Digital Freelancing",
    description:
      "Start your freelancing career in high-demand digital skills. Learn client acquisition and project management.",
    icon: Laptop,
    highlights: ["Skill Development", "Client Acquisition", "Project Management", "Scaling Strategies"],
  },
]

export function CoursesSection() {
  return (
    <section id="courses" className="container py-24 space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our Courses</h2>
        <p className="mt-4 text-muted-foreground">
          Comprehensive training programs designed to help you succeed in the digital economy
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => {
          const Icon = course.icon
          return (
            <Card key={course.title} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{course.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <CardDescription className="text-base">{course.description}</CardDescription>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {course.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-center">
                      <span className="mr-2">•</span>
                      {highlight}
                    </li>
                  ))}
                </ul>
                <Button className="w-full mt-4" variant="outline">
                  Learn More
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
      <div className="text-center mt-12">
        <Button size="lg" className="bg-primary">
          Enroll Now
        </Button>
      </div>
    </section>
  )
}

