import { NextResponse } from "next/server";
import { Query, Client, Users } from "node-appwrite";
import { databases } from "@/lib/serverAppwriteClient";

// GET endpoint – pro každý referral se doplní údaje o referovaném uživateli (Name, Email)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const referrerId = searchParams.get("referrerId");

    if (!referrerId) {
      return NextResponse.json({ error: "Missing referrerId" }, { status: 400 });
    }

    console.log("Fetching referrals for:", referrerId);

    const referrals = await databases.listDocuments(
      process.env.APPWRITE_DATABASE_ID,
      "referrals",
      [Query.equal("referrerId", referrerId)]
    );

    // Inicializace klienta pro získání údajů z Appwrite Auth
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT)
      .setKey(process.env.APPWRITE_API_KEY);
    const users = new Users(client);

    const referralsWithDetails = await Promise.all(
      referrals.documents.map(async (referral) => {
        try {
          const userDetails = await users.get(referral.referredId);
          return {
            ...referral,
            referredName: userDetails.name || "N/A",
            referredEmail: userDetails.email || "N/A",
          };
        } catch (error) {
          console.error(`Error fetching details for user ${referral.referredId}:`, error);
          return {
            ...referral,
            referredName: "N/A",
            referredEmail: "N/A",
          };
        }
      })
    );

    return NextResponse.json({ documents: referralsWithDetails });
  } catch (error) {
    console.error("Referrals API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch referrals" },
      { status: 500 }
    );
  }
}

// POST endpoint – vytvoří unikátní referral záznam s document id rovno referredId.
// Pole referredName a referredEmail již nejsou ukládána, aby nedocházelo k chybě.
export async function POST(request) {
  try {
    const { referrerId, referredId } = await request.json();

    if (!referrerId || !referredId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Zabráníme self-referralu.
    if (referrerId === referredId) {
      console.log("Self-referral detected, not recording referral.");
      return NextResponse.json({ message: "Self-referral not recorded" });
    }

    // Zkontrolujeme, zda již existuje referral s dokumentem id = referredId.
    try {
      await databases.getDocument(
        process.env.APPWRITE_DATABASE_ID,
        "referrals",
        referredId
      );
      console.log("Referral already exists for referredId:", referredId);
      return NextResponse.json({ message: "Referral already recorded" });
    } catch (error) {
      console.log("No existing referral, proceeding to create one.");
    }

    const referral = await databases.createDocument(
      process.env.APPWRITE_DATABASE_ID,
      "referrals",
      referredId, // použijeme referredId jako unikátní document id
      {
        referrerId,
        referredId,
        lastPaidDate: new Date().toISOString(),
        status: "active",
        commissionAmount: "0.00",
      }
    );

    console.log("Created referral document:", referral);
    return NextResponse.json(referral);
  } catch (error) {
    console.error("Create referral error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create referral" },
      { status: 500 }
    );
  }
}