import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Laptop, Users, Trophy, Target, BookOpen, TrendingUp } from "lucide-react"

const features = [
  {
    title: "Expert Mentorship",
    description: "Learn directly from successful entrepreneurs and industry experts",
    icon: Users,
  },
  {
    title: "Practical Skills",
    description: "Focus on real-world applications and proven strategies",
    icon: Laptop,
  },
  {
    title: "Success Track",
    description: "Follow a structured path to achieve your financial goals",
    icon: Trophy,
  },
  {
    title: "Market Insights",
    description: "Stay ahead with cutting-edge market analysis and trends",
    icon: Target,
  },
  {
    title: "Comprehensive Courses",
    description: "Access detailed courses covering multiple income streams",
    icon: BookOpen,
  },
  {
    title: "Growth Community",
    description: "Connect with like-minded individuals and grow together",
    icon: TrendingUp,
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="container py-24">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Why Choose OFFTRADER</h2>
        <p className="mt-4 text-muted-foreground">
          Discover what makes our academy the perfect choice for your success
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon
          return (
            <Card key={feature.title}>
              <CardHeader>
                <Icon className="h-12 w-12 mb-4" />
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          )
        })}
      </div>
    </section>
  )
}

