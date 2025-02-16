"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CopyIcon } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function DashboardPage() {
  const [userData, setUserData] = useState(null)
  const [referrals, setReferrals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    const fetchData = async () => {
      try {
        const [userResponse, referralsResponse] = await Promise.all([
          fetch(`/api/dashboard?userId=${user.$id}`),
          fetch(`/api/referrals?referrerId=${user.$id}`)
        ])

        if (!userResponse.ok || !referralsResponse.ok) 
          throw new Error('Failed to fetch data')

        const userData = await userResponse.json()
        const referralsData = await referralsResponse.json()

        setUserData(userData)
        setReferrals(referralsData.documents || [])
      } catch (err) {
        setError(err.message || 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user, router])

  const handleCopyReferralLink = () => {
    if (userData?.referralLink) {
      navigator.clipboard.writeText(userData.referralLink)
      alert("Referral link copied to clipboard!")
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!userData) return <div>No user data available</div>

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold">Welcome, {userData.name}</h1>
        <p>{userData.email}</p>
        <p className="text-lg">
          Elearning se nachází na <a href="https://academy.offtrader.ru/" className="text-blue-500 underline">https://academy.offtrader.ru/</a>. 
          Pro přihlášení použijte jako login váš email co používáte zde a stejné heslo.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Current Subscription</CardTitle>
            <CardDescription>Your active plan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-2xl font-bold">{userData.subscriptionPlan}</p>
            <p className="text-sm text-muted-foreground">
              Status: {userData.subscriptionStatus}
            </p>
            <p className="text-sm text-muted-foreground">
              Expires: {new Date(userData.subscriptionExpiresAt).toLocaleDateString()}
            </p>
            <Button 
              onClick={() => router.push('/checkout')}
              variant="outline"
              className="w-full"
            >
              Change Subscription
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Referral Balance</CardTitle>
            <CardDescription>Your earnings from referrals</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${userData.balance?.toFixed(2) || "0.00"}</p>
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

      <Card>
        <CardHeader>
          <CardTitle>Your Referrals</CardTitle>
          <CardDescription>People who signed up using your referral link</CardDescription>
        </CardHeader>
        <CardContent>
          {referrals.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No referrals yet. Share your link to start earning!
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Subscription Plan</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Last Paid</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {referrals.map((referral) => (
                  <TableRow key={referral.$id}>
                    <TableCell>{referral.referredName || "N/A"}</TableCell>
                    <TableCell>{referral.referredEmail || "N/A"}</TableCell>
                    <TableCell>{referral.subscriptionPlan}</TableCell>
                    <TableCell>${parseFloat(referral.commissionAmount).toFixed(2)}</TableCell>
                    <TableCell>
                      {new Date(referral.lastPaidDate).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}