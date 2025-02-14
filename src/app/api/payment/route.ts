import { NextResponse } from "next/server";
import { databases } from "@/lib/serverAppwriteClient";

const pricingPlans: Record<"basic" | "pro" | "elite", { monthly: string; yearly: string }> = {
  basic: { monthly: "49.00", yearly: "470.00" },
  pro: { monthly: "99.00", yearly: "950.00" },
  elite: { monthly: "199.00", yearly: "1900.00" },
};

export async function POST(request: Request) {
  try {
    const { planId, billingPeriod, description, userId } = await request.json() as {
      planId: "basic" | "pro" | "elite";
      billingPeriod: "monthly" | "yearly";
      description?: string;
      userId: string;
    };

    if (
      !planId ||
      !billingPeriod ||
      !pricingPlans[planId] ||
      !["monthly", "yearly"].includes(billingPeriod) ||
      !userId
    ) {
      return NextResponse.json(
        { error: "Neplatné parametry" },
        { status: 400 }
      );
    }

    const amount = pricingPlans[planId][billingPeriod];

    const endpoint = process.env.YOOKASSA_ENDPOINT;
    const shopId = process.env.YOOKASSA_SHOP_ID;
    const secretKey = process.env.YOOKASSA_SECRET_KEY;

    if (!endpoint || !shopId || !secretKey) {
      return NextResponse.json(
        { error: "Chybí YooKassa nastavení." },
        { status: 500 }
      );
    }

    const idempotenceKey = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 15)}`;

    const payload = {
      amount: {
        value: amount,
        currency: "RUB",
      },
      capture: true,
      save_payment_method: true,
      payment_method_data: {
        type: "bank_card",
      },
      confirmation: {
        type: "redirect",
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment-successful`,
      },
      description:
        description && description.length <= 128
          ? description
          : "Payment description",
    };

    const auth = Buffer.from(`${shopId}:${secretKey}`).toString("base64");

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
        "Idempotence-Key": idempotenceKey,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Chyba při vytváření platby" },
        { status: response.status }
      );
    }

    // Uloží paymentMethodId do dokumentu uživatele v Appwrite databázi
    if (data.payment_method?.id) {
      try {
        await databases.updateDocument(
          process.env.APPWRITE_DATABASE_ID!,
          process.env.APPWRITE_COLLECTION_ID!,
          userId,
          { paymentMethodId: data.payment_method.id }
        );
      } catch (updateError: any) {
        // Pokud dokument neexistuje (error kód 404), vytvoř dokument
        if (updateError.code === 404) {
          try {
            await databases.createDocument(
              process.env.APPWRITE_DATABASE_ID!,
              process.env.APPWRITE_COLLECTION_ID!,
              userId,
              { paymentMethodId: data.payment_method.id }
            );
          } catch (createError: any) {
            console.error("Failed to create document:", createError);
            return NextResponse.json(
              { error: "Failed to store payment method ID" },
              { status: 500 }
            );
          }
        } else {
          console.error("Failed to update document:", updateError);
          return NextResponse.json(
            { error: "Failed to store payment method ID" },
            { status: 500 }
          );
        }
      }
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || error.toString() },
      { status: 500 }
    );
  }
}