import { NextResponse } from "next/server";

// Hardcodované ceny – tyto hodnoty nelze měnit z klienta
const pricingPlans = {
  basic: { monthly: "49.00", yearly: "470.00" },
  pro: { monthly: "99.00", yearly: "950.00" },
  elite: { monthly: "199.00", yearly: "1900.00" },
};

export async function POST(request: Request) {
  try {
    // Očekáváme planId a billingPeriod namísto volné ceny
    const { planId, billingPeriod, description } = await request.json();

    if (
      !planId ||
      !billingPeriod ||
      !pricingPlans[planId] ||
      !["monthly", "yearly"].includes(billingPeriod)
    ) {
      return NextResponse.json({ error: "Neplatné parametry" }, { status: 400 });
    }

    const amount = pricingPlans[planId][billingPeriod];

    const endpoint = process.env.YOOKASSA_ENDPOINT;
    const shopId = process.env.YOOKASSA_SHOP_ID;
    const secretKey = process.env.YOOKASSA_SECRET_KEY;
    
    if (!endpoint || !shopId || !secretKey) {
      return NextResponse.json({ error: "Chybí YooKassa nastavení." }, { status: 500 });
    }

    // Vygenerujeme idempotence key, abychom předešli duplicitám
    const idempotenceKey = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;

    const payload = {
      amount: {
        value: amount,
        currency: "RUB",
      },
      capture: true,
      // Tento parametr zajistí, že platební metoda bude uložena pro opakované platby
      save_payment_method: true,
      payment_method_data: {
        type: "bank_card",
      },
      confirmation: {
        type: "redirect",
        return_url: "http://localhost:3000/payment-successful",
      },
      // Popis platby – musí být maximálně 128 znaků
      description: description && description.length <= 128 ? description : "Payment description",
    };

    const auth = Buffer.from(`${shopId}:${secretKey}`).toString("base64");

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${auth}`,
        "Idempotence-Key": idempotenceKey,
      },
      body: JSON.stringify(payload),
    });

    // Oprava: dokončíme řádek voláním .json()
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.message || "Chyba při vytváření platby" }, { status: response.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || error.toString() }, { status: 500 });
  }
}