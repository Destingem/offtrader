import { Button } from "@/components/ui/button"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="bg-primary py-16">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary-foreground mb-4">
          Ready to Enter the Digital Matrix?
        </h2>
        <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
          Experience the power of OFFTRADER Academy firsthand. Try our demo and take the first step towards mastering
          the digital realm.
        </p>
        <div className="flex justify-center gap-4">
          <Button size="lg" variant="secondary" asChild>
            <Link href="https://academy.offtrader.ru">Try Demo</Link>
          </Button>
       
        </div>
      </div>
    </section>
  )
}

