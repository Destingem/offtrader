import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Code, DollarSign, Users } from "lucide-react"

const processSteps = [
  {
    title: "Learn",
    description: "Absorb cutting-edge knowledge from industry experts",
    icon: BookOpen,
    color: "text-blue-500",
  },
  {
    title: "Practice",
    description: "Apply your skills in real-world scenarios and projects",
    icon: Code,
    color: "text-green-500",
  },
  {
    title: "Network",
    description: "Connect with like-minded individuals and potential partners",
    icon: Users,
    color: "text-purple-500",
  },
  {
    title: "Earn",
    description: "Monetize your expertise and start building wealth",
    icon: DollarSign,
    color: "text-yellow-500",
  },
]

export function ProcessSection() {
  return (
    <section id="process" className="container py-24 space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our Process</h2>
        <p className="mt-4 text-muted-foreground">Follow these steps to success in the digital economy</p>
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {processSteps.map((step, index) => {
          const Icon = step.icon
          return (
            <Card key={step.title} className="relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 text-4xl font-bold text-muted-foreground/20">{index + 1}</div>
              <CardHeader>
                <Icon className={`h-10 w-10 ${step.color}`} />
                <CardTitle className="mt-4">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{step.description}</CardDescription>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}

