// /src/app/api/referrer/route.js
import { NextResponse } from "next/server";
import { databases } from "@/lib/serverAppwriteClient";

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
const COLLECTION_ID = "referrals"; // Kolekce referralů

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId parameter" },
        { status: 400 }
      );
    }

    console.log("Fetching referral document for userId:", userId);

    const document = await databases.getDocument(
      DATABASE_ID,
      COLLECTION_ID,
      userId
    );

    console.log("Fetched referral document:", document);
    const referrerId = document.referrerId;
    return NextResponse.json({ referrerId });
  } catch (error) {
    console.error("Error fetching referral:", error);
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}