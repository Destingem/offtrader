import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function PaymentSuccessful() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold">Payment Successful!</CardTitle>
          <CardDescription>Thank you for joining OFFTRADER Academy</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-lg font-semibold">Order Summary</p>
            <p className="text-muted-foreground">Pro Plan - Annual Subscription</p>
            <p className="text-2xl font-bold mt-2">$950.00</p>
          </div>
          <div className="border-t pt-4">
            <p className="font-semibold mb-2">Next Steps:</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground">
              <li>Check your email for login details</li>
              <li>Set up your profile in the member area</li>
              <li>Explore available courses and start learning</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button asChild className="w-full">
            <Link href="www.offtrader.ru">Go to Platform</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/">Return to Homepage</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

