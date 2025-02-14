"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CopyIcon } from "lucide-react"

// Mock user data (replace with actual data fetching in a real application)
const mockUserData = {
  name: "John Doe",
  email: "john@example.com",
  subscription: "Pro Plan",
  referralLink: "https://offtrader.ru/ref/johndoe123",
  balance: 250,
}

export default function DashboardPage() {
  const [userData, setUserData] = useState(mockUserData)
  const router = useRouter()

  useEffect(() => {
    // In a real application, you would fetch the user data here
    // and update the state with setUserData
  }, [])

  const handleCopyReferralLink = () => {
    navigator.clipboard.writeText(userData.referralLink)
    alert("Referral link copied to clipboard!")
  }

  const handleLogout = () => {
    // In a real application, you would handle the logout logic here
    router.push("/")
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Welcome, {userData.name}</h1>
        <Button onClick={handleLogout}>Logout</Button>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Current Subscription</CardTitle>
            <CardDescription>Your active plan</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{userData.subscription}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Referral Balance</CardTitle>
            <CardDescription>Your earnings from referrals</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${userData.balance.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Referral Link</CardTitle>
          <CardDescription>Share this link to earn rewards</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input value={userData.referralLink} readOnly />
            <Button onClick={handleCopyReferralLink}>
              <CopyIcon className="h-4 w-4 mr-2" />
              Copy
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Earn 10% of the subscription fee for each new user who signs up using your referral link!
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

