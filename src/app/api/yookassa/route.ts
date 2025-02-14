import { NextResponse } from "next/server";
import { databases } from "@/lib/serverAppwriteClient";

export async function POST(request: Request) {
  try {
    const eventData = await request.json();
    console.log("Received YooKassa webhook event:", eventData);

    if (!eventData.event) {
      return NextResponse.json({ error: "No event type specified" }, { status: 400 });
    }

    // Process the event based on its type.
    switch (eventData.event) {
      case "payment.waiting_for_capture":
        console.log("Payment waiting for capture:", eventData);
        break;
      case "payment.succeeded": {
        console.log("Payment succeeded:", eventData);
        const payment = eventData.object;
        // Assume payment.created_at is in ISO format or similar.
        const createdAt = new Date(payment.created_at);
        let expiration = new Date(createdAt);
  
        // Determine billing period. Prefer metadata field if available.
        let billingPeriod = payment.metadata?.billingPeriod;
        if (!billingPeriod && payment.description) {
          if (payment.description.toLowerCase().includes("year")) {
            billingPeriod = "yearly";
          } else {
            billingPeriod = "monthly";
          }
        }
  
        // Calculate subscription expiration date.
        if (billingPeriod === "yearly") {
          expiration.setFullYear(expiration.getFullYear() + 1);
        } else {
          expiration.setMonth(expiration.getMonth() + 1);
        }
  
        // Determine subscription plan from description.
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
  
        // Assume that the payment metadata contains the userId.
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
            console.log(`Updated subscription for user ${userId}`);
          } catch (updateError: any) {
            console.error("Error updating subscription:", updateError);
          }
        } else {
          console.warn("User ID not found in payment metadata");
        }
        break;
      }
      case "payment.canceled":
        console.log("Payment canceled:", eventData);
        break;
      case "refund.succeeded":
        console.log("Refund succeeded:", eventData);
        break;
      default:
        console.log("Unhandled event type:", eventData.event);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err: any) {
    console.error("Error processing webhook:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}