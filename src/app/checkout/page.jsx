"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { membershipPlans } from "@/config/plans";
import { useAuth } from "@/context/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, register, refreshUser, referralCode } = useAuth();
  const [isYearly, setIsYearly] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(membershipPlans[1]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [referralInput, setReferralInput] = useState(referralCode || "");

  // Automatické nastavení referral kódu z kontextu
  useEffect(() => {
    if (referralCode) {
      setReferralInput(referralCode);
    }
  }, [referralCode]);

  // Pokud referralInput není nastavený a uživatel je přihlášen, zkusíme ho načíst z API
  useEffect(() => {
    async function fetchReferral() {
      if (user && !referralInput) {
        try {
          const res = await fetch(`/api/referrer?userId=${user.$id}`);
          if (res.ok) {
            const data = await res.json();
            if (data.referrerId) {
              console.log("Referral code fetched from API:", data.referrerId);
              setReferralInput(data.referrerId);
            }
          } else {
            console.log("No referral code found via API.");
          }
        } catch (err) {
          console.error("Error fetching referral code:", err);
        }
      }
    }
    fetchReferral();
  }, [user, referralInput]);

  const handlePlanChange = (plan) => {
    setSelectedPlan(plan);
  };

  const getPrice = (plan) => {
    return isYearly ? plan.yearlyPrice : plan.monthlyPrice;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const billingPeriod = isYearly ? "yearly" : "monthly";
    let currentUser = user;

    // Pokud není uživatel přihlášen, registrujeme ho.
    if (!currentUser) {
      if (!email || !password || !name) {
        setError("Vyplňte prosím všechna pole pro registraci.");
        return;
      }
      try {
        await register(email, password, name);
        // Krátká pauza pro inicializaci session
        await new Promise((resolve) => setTimeout(resolve, 500));
        currentUser = await refreshUser();
        if (!currentUser) {
          setError("Uživatel nebyl nalezen po registraci.");
          return;
        }
      } catch (regError) {
        setError(regError.message || "Registrace se nezdařila");
        return;
      }
    }

    // Vytvoříme payload s metadaty podle dokumentace YooKassa, včetně referral kódu (pokud existuje)
    const paymentPayload = {
      description: `${selectedPlan.name} Plan Subscription`,
      metadata: {
        userId: currentUser.$id,
        planId: selectedPlan.id,
        billingPeriod: billingPeriod,
        referralCode: referralInput || null,
      },
    };

    try {
      // Pokud je zadán referral kód, vytvoříme referral záznam
      if (referralInput) {
        await fetch("/api/referrals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            referrerId: referralInput,
            referredId: currentUser.$id,
            subscriptionPlan: selectedPlan.id,
          }),
        });
      }

      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentPayload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Chyba při zpracování platby");
        return;
      }

      // Přesměrujeme uživatele na URL pro potvrzení platby.
      if (data.confirmation?.confirmation_url) {
        window.location.href = data.confirmation.confirmation_url;
      } else {
        setError("Chyba: Neplatná odpověď od platebního systému");
      }
    } catch (err) {
      setError(err.message || "Došlo k chybě při zpracování platby");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="flex-grow">
        <div className="container mx-auto max-w-5xl py-12">
          <h1 className="text-3xl font-bold text-center mb-8">
            Choose Your Membership
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="flex justify-center items-center space-x-4 mb-8">
              <span className={!isYearly ? "font-semibold" : "text-muted-foreground"}>
                Monthly
              </span>
              <Switch checked={isYearly} onCheckedChange={setIsYearly} />
              <span className={isYearly ? "font-semibold" : "text-muted-foreground"}>
                Yearly (save up to 20%)
              </span>
            </div>

            <div className="grid gap-6 mb-8 md:grid-cols-3">
              {membershipPlans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`relative cursor-pointer transition-all duration-200 ${
                    selectedPlan.id === plan.id
                      ? "border-primary ring-2 ring-primary"
                      : "hover:border-primary"
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

            {/* Pokud uživatel není přihlášen, zobrazíme registrační formulář */}
            {!user && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Create Account</CardTitle>
                  <CardDescription>
                    Create an account to complete your order
                  </CardDescription>
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
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
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
                <div className="space-y-2 mt-4">
                  <Label htmlFor="referral">Referral Code</Label>
                  <Input
                    id="referral"
                    type="text"
                    placeholder="Enter referral code (optional)"
                    value={referralInput}
                    onChange={(e) => setReferralInput(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">
                  {user ? "Complete Payment" : "Create Account & Pay"}
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