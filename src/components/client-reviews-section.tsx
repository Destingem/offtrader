"use client"

import { useCallback, useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const reviews = [
  {
    name: "Alex Johnson",
    avatar: "/placeholder.svg",
    role: "Entrepreneur",
    content:
      "OFFTRADER Academy transformed my approach to digital business. The crypto course was particularly eye-opening!",
    rating: 5,
  },
  {
    name: "Sarah Lee",
    avatar: "/placeholder.svg",
    role: "Marketing Specialist",
    content: "The social media marketing course helped me skyrocket my client's online presence. Highly recommended!",
    rating: 5,
  },
  {
    name: "Mike Chen",
    avatar: "/placeholder.svg",
    role: "E-commerce Owner",
    content: "Thanks to the e-commerce course, I've been able to scale my online store beyond my wildest dreams.",
    rating: 4,
  },
  {
    name: "Emily Rodriguez",
    avatar: "/placeholder.svg",
    role: "Freelance Designer",
    content:
      "The digital freelancing course gave me the confidence and skills to start my own business. I'm now fully booked!",
    rating: 5,
  },
  {
    name: "David Kim",
    avatar: "/placeholder.svg",
    role: "Stock Trader",
    content:
      "The stock market strategies course is gold. I've seen a significant improvement in my trading performance.",
    rating: 4,
  },
]

export function ClientReviewsSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [isPaused, setIsPaused] = useState(false)

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  useEffect(() => {
    if (emblaApi) {
      let intervalId: NodeJS.Timeout

      const startAutoplay = () => {
        intervalId = setInterval(() => {
          if (!isPaused) {
            emblaApi.scrollNext()
          }
        }, 5000) // Change slide every 5 seconds
      }

      startAutoplay()

      return () => {
        if (intervalId) clearInterval(intervalId)
      }
    }
  }, [emblaApi, isPaused])

  return (
    <section className="container py-24 space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">What Our Clients Say</h2>
        <p className="mt-4 text-muted-foreground">
          Don't just take our word for it. Here's what OFFTRADER Academy members have to say.
        </p>
      </div>
      <div className="relative" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {reviews.map((review, index) => (
              <div key={index} className="flex-[0_0_100%] min-w-0 px-4 sm:flex-[0_0_50%] lg:flex-[0_0_33.33%]">
                <Card className="h-full">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar>
                        <AvatarImage src={review.avatar} alt={review.name} />
                        <AvatarFallback>
                          {review.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{review.name}</h3>
                        <p className="text-sm text-muted-foreground">{review.role}</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-4">{review.content}</p>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
          onClick={scrollPrev}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
          onClick={scrollNext}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </section>
  )
}

