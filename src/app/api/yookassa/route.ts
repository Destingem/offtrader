import { NextResponse } from "next/server";
import { Query } from "node-appwrite";
import { databases } from "@/lib/serverAppwriteClient";

export async function POST(request: Request) {
  try {
    const eventData = await request.json();

    if (!eventData.event) {
      return NextResponse.json({ error: "No event type specified" }, { status: 400 });
    }

    switch (eventData.event) {
      case "payment.waiting_for_capture":
        break;
      case "payment.succeeded": {
        const payment = eventData.object;
        const createdAt = new Date(payment.created_at);
        let expiration = new Date(createdAt);
        console.log(payment);
        let billingPeriod = payment.metadata?.billingPeriod;
        if (!billingPeriod && payment.description) {
          billingPeriod = payment.description.toLowerCase().includes("year") ? "yearly" : "monthly";
        }

        if (billingPeriod === "yearly") {
          expiration.setFullYear(expiration.getFullYear() + 1);
        } else {
          expiration.setMonth(expiration.getMonth() + 1);
        }

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

        const userId = payment.metadata?.userId;
        if (userId) {
          try {
            await databases.updateDocument(
              process.env.APPWRITE_DATABASE_ID!,
              process.env.APPWRITE_COLLECTION_ID!,
              userId,
              {
                subscriptionStatus: "active",
                subscriptionPlan,
                subscriptionExpiresAt: expiration.toISOString(),
              }
            );
          } catch (updateError) {
            // Error handling dle potřeby
          }
        }

        if (userId) {
          try {
            const referralRecords = await databases.listDocuments(
              process.env.APPWRITE_DATABASE_ID!,
              "referrals",
              [Query.equal("referredId", userId)]
            );
            if (referralRecords.documents.length > 0) {
              const referralDoc = referralRecords.documents[0];
              const amountValue = parseFloat(payment.amount.value) || 0;
              if (amountValue !== 0) {
                const commission = amountValue * 0.10;
                const currentCommission = parseFloat(referralDoc.commissionAmount || "0");
                const newCommission = (currentCommission + commission).toFixed(2);

                await databases.updateDocument(
                  process.env.APPWRITE_DATABASE_ID!,
                  "referrals",
                  referralDoc.$id,
                  {
                    commissionAmount: newCommission,
                    lastPaidDate: new Date().toISOString(),
                  }
                );
              }
            }
          } catch (referralError) {
            // Error handling dle potřeby
          }
        }
        break;
      }
      case "payment.canceled":
        break;
      case "refund.succeeded":
        break;
      default:
        break;
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}