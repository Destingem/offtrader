// /api/cron/route.js
import { NextResponse } from "next/server";
import { Query } from "node-appwrite";
import { databases } from "@/lib/serverAppwriteClient";

// Funkce pro aktualizaci předplatného v Moodle
async function updateMoodleForExpiredSubscription(userId) {
  const moodleBaseUrl = "https://academy.offtrader.ru/r.php/api/rest/v2";
  const token = process.env.MOODLE_TOKEN;
  const url = `${moodleBaseUrl}/user/${userId}/preferences/subscription_status?wstoken=${token}&moodlewsrestformat=json`;
  const body = { value: "inactive" };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  return response.json();
}

export async function GET(request) {
  try {
    const now = new Date().toISOString();

    // Načtení aktivních předplatných, jejichž datum expirace již uplynulo
    const expiredSubscriptions = await databases.listDocuments(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_COLLECTION_ID,
      [
        Query.equal("subscriptionStatus", "active"),
        Query.lessThan("subscriptionExpiresAt", now)
      ]
    );

    // Pro každý vypršelý záznam:
    for (const subscription of expiredSubscriptions.documents) {
      const userId = subscription.$id; // Předpokládáme, že document id odpovídá userId
      // Aktualizace v Moodle – nastavíme předplatné jako neaktivní
      await updateMoodleForExpiredSubscription(userId);
      // Odstranění předplatného z databáze
      await databases.deleteDocument(
        process.env.APPWRITE_DATABASE_ID,
        process.env.APPWRITE_COLLECTION_ID,
        userId
      );
    }

    return NextResponse.json({
      message: "Cron job executed",
      processed: expiredSubscriptions.documents.length
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}