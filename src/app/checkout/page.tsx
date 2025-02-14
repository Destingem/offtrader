"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";

const membershipPlans = [
  {
    id: "basic",
    name: "Basic",
    monthlyPrice: 49,
    yearlyPrice: 470,
    description: "Essential tools to start your journey",
    features: ["Access to 2 courses", "Basic community access", "Monthly Q&A sessions", "Email support"],
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: 99,
    yearlyPrice: 950,
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
    id: "elite",
    name: "Elite",
    monthlyPrice: 199,
    yearlyPrice: 1900,
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
];

export default function CheckoutPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(membershipPlans[1]);
  const [isYearly, setIsYearly] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Zde můžete načíst stav přihlášení uživatele, pokud je třeba
  }, []);

  const handlePlanChange = (plan: typeof membershipPlans[0]) => {
    setSelectedPlan(plan);
  };

  const getPrice = (plan: typeof membershipPlans[0]) => {
    return isYearly ? plan.yearlyPrice : plan.monthlyPrice;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Sestavíme payload s hardcodovanými cenami dle výběru uživatele
    const billingPeriod = isYearly ? "yearly" : "monthly";
    const payload = {
      planId: selectedPlan.id,
      billingPeriod,
      description: `${selectedPlan.name} Plan Subscription`,
    };

    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Chyba při zpracování platby");
        return;
      }

      // Přesměrujeme uživatele na URL pro potvrzení platby, kterou vrací API (confirmation.confirmation_url)
      if (data.confirmation && data.confirmation.confirmation_url) {
        window.location.href = data.confirmation.confirmation_url;
      } else {
        setError("Chyba: Neplatná odpověď od platebního systému");
      }
    } catch (err: any) {
      setError(err.message || "Došlo k chybě při zpracování platby");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="flex-grow">
        <div className="container mx-auto max-w-5xl py-12">
          <h1 className="text-3xl font-bold text-center mb-8">Choose Your Membership</h1>
          <form onSubmit={handleSubmit}>
            <div className="flex justify-center items-center space-x-4 mb-8">
              <span className={!isYearly ? "font-semibold" : "text-muted-foreground"}>Monthly</span>
              <Switch checked={isYearly} onCheckedChange={setIsYearly} />
              <span className={isYearly ? "font-semibold" : "text-muted-foreground"}>Yearly (save up to 20%)</span>
            </div>

            <div className="grid gap-6 mb-8 md:grid-cols-3">
              {membershipPlans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`relative cursor-pointer transition-all duration-200 ${
                    selectedPlan.id === plan.id ? "border-primary ring-2 ring-primary" : "hover:border-primary"
                  }`}
                  onClick={() => handlePlanChange(plan)}
                >
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold mb-2">
                      ${getPrice(plan)}
                      <span className="text-sm font-normal text-muted-foreground">
                        /{isYearly ? "year" : "month"}
                      </span>
                    </div>
                    {isYearly && (
                      <p className="text-sm text-muted-foreground mb-4">
                        Billed annually at ${plan.yearlyPrice}/year
                      </p>
                    )}
                    <ul className="space-y-2 text-sm">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <Check className="h-4 w-4 mr-2 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <div className="w-full text-center font-medium">
                      {selectedPlan.id === plan.id ? "Selected" : "Click to select"}
                    </div>
                  </CardFooter>
                  {selectedPlan.id === plan.id && (
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-2 py-1 text-sm rounded-bl">
                      Selected
                    </div>
                  )}
                </Card>
              ))}
            </div>

            {!isLoggedIn && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Create Account</CardTitle>
                  <CardDescription>Create an account to complete your order</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span>{selectedPlan.name} Plan</span>
                  <span>
                    ${getPrice(selectedPlan)} {isYearly ? "/ year" : "/ month"}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  {isYearly ? "Annual" : "Monthly"} payment. You can cancel anytime.
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">
                  {isLoggedIn ? "Complete Payment" : "Create Account & Pay"}
                </Button>
              </CardFooter>
            </Card>
            {error && <p className="text-center text-red-500 mt-4">{error}</p>}
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}