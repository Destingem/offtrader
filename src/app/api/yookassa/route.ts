import { NextResponse } from "next/server";
import { Query } from "node-appwrite";
import { databases } from "@/lib/serverAppwriteClient";

export async function POST(request) {
  try {
    const eventData = await request.json();
    console.log("Received YooKassa webhook event:", JSON.stringify(eventData, null, 2));

    if (!eventData.event) {
      return NextResponse.json({ error: "No event type specified" }, { status: 400 });
    }

    switch (eventData.event) {
      case "payment.waiting_for_capture":
        console.log("Payment waiting for capture:", JSON.stringify(eventData, null, 2));
        break;
      case "payment.succeeded": {
        console.log("Payment succeeded:", JSON.stringify(eventData, null, 2));
        const payment = eventData.object;
        console.log("Payment object:", JSON.stringify(payment, null, 2));

        const createdAt = new Date(payment.created_at);
        let expiration = new Date(createdAt);

        // Určení billing period – preferujeme metadata, případně dle description
        let billingPeriod = payment.metadata?.billingPeriod;
        if (!billingPeriod && payment.description) {
          billingPeriod = payment.description.toLowerCase().includes("year") ? "yearly" : "monthly";
        }
        console.log("Billing period determined as:", billingPeriod);

        // Výpočet data expirace předplatného
        if (billingPeriod === "yearly") {
          expiration.setFullYear(expiration.getFullYear() + 1);
        } else {
          expiration.setMonth(expiration.getMonth() + 1);
        }
        console.log("Calculated expiration date:", expiration.toISOString());

        // Určení typu předplatného z description
        let subscriptionPlan = "unknown";
        if (payment.description) {
          const descLower = payment.description.toLowerCase();
          if (descLower.includes("basic")) {
            subscriptionPlan = "basic";
          } else if (descLower.includes("pro")) {
            subscriptionPlan = "pro";
          } else if (descLower.includes("elite")) {
            subscriptionPlan = "elite";
          }
        }
        console.log("Determined subscription plan:", subscriptionPlan);

        // Aktualizace předplatného uživatele v DB
        const userId = payment.metadata?.userId;
        console.log("User ID from payment metadata:", userId);
        if (userId) {
          try {
            await databases.updateDocument(
              process.env.APPWRITE_DATABASE_ID,
              process.env.APPWRITE_COLLECTION_ID,
              userId,
              {
                subscriptionStatus: "active",
                subscriptionPlan,
                subscriptionExpiresAt: expiration.toISOString(),
              }
            );
            console.log(`Updated subscription for user ${userId}`);
          } catch (updateError) {
            console.error("Error updating subscription:", updateError);
          }
        } else {
          console.warn("User ID not found in payment metadata");
        }

        // --- Referral logika ---
        if (userId) {
          try {
            console.log("Searching for referral record for referred user:", userId);
            const referralRecords = await databases.listDocuments(
              process.env.APPWRITE_DATABASE_ID,
              "referrals",
              [Query.equal("referredId", userId)]
            );
            console.log("Number of referral records found:", referralRecords.documents.length);

            if (referralRecords.documents.length > 0) {
              const referralDoc = referralRecords.documents[0];
              console.log("Referral record found:", JSON.stringify(referralDoc, null, 2));

              // Kontrola hodnoty platby
              console.log("Payment.amount:", JSON.stringify(payment.amount, null, 2));
              const amountValue = parseFloat(payment.amount.value) || 0;
              console.log("Payment amount value:", payment.amount.value, "parsed as", amountValue);

              // Pokud je částka 0, logujeme varování a nepřičítáme nic.
              if (amountValue === 0) {
                console.warn("Payment amount is zero; commission will not be added.");
              } else {
                const commission = amountValue * 0.10;
                console.log("Calculated commission (10%):", commission);

                const currentCommission = parseFloat(referralDoc.commissionAmount || "0");
                console.log("Current commission in DB:", referralDoc.commissionAmount, "parsed as", currentCommission);

                const newCommission = (currentCommission + commission).toFixed(2);
                console.log("New commission to be stored:", newCommission);

                await databases.updateDocument(
                  process.env.APPWRITE_DATABASE_ID,
                  "referrals",
                  referralDoc.$id,
                  {
                    commissionAmount: newCommission,
                    lastPaidDate: new Date().toISOString(),
                  }
                );
                console.log(`Updated referral commission for referrer ${referralDoc.referrerId}: ${newCommission}`);
              }
            } else {
              console.log("No referral record found for referred user", userId);
            }
          } catch (referralError) {
            console.error("Error processing referral commission:", referralError);
          }
        }
        // --- Konec referral logiky ---
        break;
      }
      case "payment.canceled":
        console.log("Payment canceled:", JSON.stringify(eventData, null, 2));
        break;
      case "refund.succeeded":
        console.log("Refund succeeded:", JSON.stringify(eventData, null, 2));
        break;
      default:
        console.log("Unhandled event type:", eventData.event);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error("Error processing webhook:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}