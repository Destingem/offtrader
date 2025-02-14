"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  Tooltip,
} from "recharts"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Ban, Trash, Edit, Play, Key, Search, Plus } from "lucide-react"
import { EditUserDialog } from "@/components/edit-user-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

// Mock data (replace with actual data fetching in a real application)
const mockUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    subscription: "Pro Plan",
    subscriptionExpiration: "2023-12-31",
    promocode: "JOHN10",
    balance: 50,
    status: "active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    subscription: "Basic Plan",
    subscriptionExpiration: "2023-11-30",
    promocode: "JANE15",
    balance: 25,
    status: "active",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    subscription: "Elite Plan",
    subscriptionExpiration: "2024-01-31",
    promocode: "BOB20",
    balance: 100,
    status: "frozen",
  },
]

const mockPaymentsData = [
  { date: "2023-05-01", amount: 1200 },
  { date: "2023-05-02", amount: 1500 },
  { date: "2023-05-03", amount: 1800 },
  { date: "2023-05-04", amount: 1300 },
  { date: "2023-05-05", amount: 2000 },
  { date: "2023-05-06", amount: 1700 },
  { date: "2023-05-07", amount: 1900 },
]

const mockSubscriptionData = [
  { name: "Basic Plan", value: 30 },
  { name: "Pro Plan", value: 50 },
  { name: "Elite Plan", value: 20 },
]

export default function AdminPanelPage() {
  const [users, setUsers] = useState(mockUsers)
  const [paymentsData, setPaymentsData] = useState(mockPaymentsData)
  const [subscriptionData, setSubscriptionData] = useState(mockSubscriptionData)
  const [totalPayments, setTotalPayments] = useState(0)
  const [editingUser, setEditingUser] = useState<(typeof mockUsers)[0] | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  useEffect(() => {
    // In a real application, you would fetch the user data and payment data here
    // and update the state with setUsers, setPaymentsData, and setSubscriptionData

    // Calculate total payments
    const total = paymentsData.reduce((sum, day) => sum + day.amount, 0)
    setTotalPayments(total)
  }, [paymentsData])

  const handleLogout = () => {
    // In a real application, you would handle the logout logic here
    router.push("/")
  }

  const totalActiveUsers = users.filter((user) => user.status === "active").length
  const activeUsersBySubscription = users.reduce(
    (acc, user) => {
      if (user.status === "active") {
        acc[user.subscription] = (acc[user.subscription] || 0) + 1
      }
      return acc
    },
    {} as Record<string, number>,
  )

  const handleFreezeAccount = (userId: number) => {
    // In a real application, you would call an API to freeze the account
    setUsers(users.map((user) => (user.id === userId ? { ...user, status: "frozen" } : user)))
  }

  const handleUnfreezeAccount = (userId: number) => {
    // In a real application, you would call an API to unfreeze the account
    setUsers(users.map((user) => (user.id === userId ? { ...user, status: "active" } : user)))
  }

  const handleDeleteAccount = (userId: number) => {
    // In a real application, you would call an API to delete the account
    setUsers(users.filter((user) => user.id !== userId))
  }

  const handleEditAccount = (user: (typeof mockUsers)[0]) => {
    setEditingUser(user)
  }

  const handleSaveUser = (updatedUser: (typeof mockUsers)[0]) => {
    // In a real application, you would call an API to update the user
    setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)))
    setEditingUser(null)
  }

  const handleResetPassword = (userId: number) => {
    // In a real application, you would call an API to reset the password
    console.log("Reset password for user", userId)
    alert(`Password reset email sent to user ${userId}`)
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <Button onClick={handleLogout}>Logout</Button>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Payments</CardTitle>
                <CardDescription>Sum of all payments received</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">${totalPayments.toFixed(2)}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total Active Users</CardTitle>
                <CardDescription>Number of active accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{totalActiveUsers}</p>
              </CardContent>
            </Card>

            {Object.entries(activeUsersBySubscription).map(([plan, count]) => (
              <Card key={plan}>
                <CardHeader>
                  <CardTitle>{plan} Users</CardTitle>
                  <CardDescription>Active users on this plan</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{count}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Payments per Day</CardTitle>
              <CardDescription>Daily payment trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  amount: {
                    label: "Amount",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={paymentsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line type="monotone" dataKey="amount" stroke="var(--color-amount)" name="Amount" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <CardDescription>Manage registered users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                  <Search className="text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add User
                </Button>
              </div>
              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Subscription</TableHead>
                      <TableHead>Expiration</TableHead>
                      <TableHead>Promocode</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.subscription}</TableCell>
                        <TableCell>{user.subscriptionExpiration}</TableCell>
                        <TableCell>{user.promocode}</TableCell>
                        <TableCell>${user.balance.toFixed(2)}</TableCell>
                        <TableCell>{user.status}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleEditAccount(user)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleResetPassword(user.id)}>
                                <Key className="mr-2 h-4 w-4" />
                                Reset Password
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  user.status === "active"
                                    ? handleFreezeAccount(user.id)
                                    : handleUnfreezeAccount(user.id)
                                }
                              >
                                {user.status === "active" ? (
                                  <>
                                    <Ban className="mr-2 h-4 w-4" />
                                    Freeze Account
                                  </>
                                ) : (
                                  <>
                                    <Play className="mr-2 h-4 w-4" />
                                    Unfreeze Account
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleDeleteAccount(user.id)}>
                                <Trash className="mr-2 h-4 w-4" />
                                Delete Account
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>Recent payment transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentsData.map((payment, index) => (
                    <TableRow key={index}>
                      <TableCell>{payment.date}</TableCell>
                      <TableCell>${payment.amount.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Distribution</CardTitle>
              <CardDescription>Active subscriptions by plan</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  value: {
                    label: "Users",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={subscriptionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {editingUser && (
        <EditUserDialog
          user={editingUser}
          open={!!editingUser}
          onOpenChange={(open) => !open && setEditingUser(null)}
          onSave={handleSaveUser}
        />
      )}
    </div>
  )
}

