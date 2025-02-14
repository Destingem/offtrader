import { NextResponse } from "next/server";
import { databases } from "@/lib/serverAppwriteClient";

export async function POST(request: Request) {
  try {
    const now = new Date();

    // List all user subscription documents.
    // Adjust the limit or pagination as needed.
    const response = await databases.listDocuments(
      process.env.APPWRITE_DATABASE_ID!,
      process.env.APPWRITE_COLLECTION_ID!,
      []
    );

    const users = response.documents;
    let updatedCount = 0;

    for (const user of users) {
      // Expected fields in each document:
      // - subscriptionStatus (string): e.g., "active"
      // - subscriptionPlan (string): e.g., "basic", "pro", "elite"
      // - subscriptionExpiresAt (string): ISO date of expiration.
      // Optional field to store group membership: group

      let updateData: Record<string, any> = {};

      const expiresAt = user.subscriptionExpiresAt;
      const status = user.subscriptionStatus;
      const plan = user.subscriptionPlan;

      if (status === "active" && expiresAt) {
        const expirationDate = new Date(expiresAt);
        if (expirationDate > now) {
          // Subscription is valid.
          updateData.group = plan; // assign group based on plan
        } else {
          // Subscription expired.
          updateData.group = "";
          updateData.subscriptionStatus = "expired";
        }
      } else {
        // No active subscription.
        updateData.group = "";
      }

      // Update the document only if changes are detected.
      // (For brevity, we'll update every document.)
      await databases.updateDocument(
        process.env.APPWRITE_DATABASE_ID!,
        process.env.APPWRITE_COLLECTION_ID!,
        user.$id,
        updateData
      );
      updatedCount++;
    }

    return NextResponse.json({ success: true, updated: updatedCount }, { status: 200 });
  } catch (error: any) {
    console.error("Error updating user groups:", error);
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}