import { NextResponse } from "next/server";
import { databases } from "@/lib/serverAppwriteClient";
import {pricingPlans} from "@/config/plansServer";

export async function POST(request) {
  try {
    const body = await request.json();
    // Očekáváme, že metadata bude obsahovat planId, billingPeriod a userId
    const { metadata, description } = body;
    if (
      !metadata ||
      !metadata.planId ||
      !metadata.billingPeriod ||
      !metadata.userId ||
      !pricingPlans[metadata.planId] ||
      !["monthly", "yearly"].includes(metadata.billingPeriod)
    ) {
      return NextResponse.json(
        { error: "Neplatné parametry" },
        { status: 400 }
      );
    }

    const planId = metadata.planId;
    const billingPeriod = metadata.billingPeriod;
    const userId = metadata.userId;
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

    // Přidáme metadata do payloadu, které budou odeslány do YooKassa
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
      metadata: metadata,
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
          process.env.APPWRITE_DATABASE_ID,
          process.env.APPWRITE_COLLECTION_ID,
          userId,
          { paymentMethodId: data.payment_method.id }
        );
      } catch (updateError) {
        // Pokud dokument neexistuje (error kód 404), vytvoříme nový dokument
        if (updateError.code === 404) {
          try {
            await databases.createDocument(
              process.env.APPWRITE_DATABASE_ID,
              process.env.APPWRITE_COLLECTION_ID,
              userId,
              { paymentMethodId: data.payment_method.id }
            );
          } catch (createError) {
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
  } catch (error) {
    return NextResponse.json(
      { error: error.message || error.toString() },
      { status: 500 }
    );
  }
}