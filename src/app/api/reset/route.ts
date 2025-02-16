// /api/moodle/change-password/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Získáme data z těla požadavku.
    const { userId, newPassword, confirmPassword } = await request.json();

    // Validace vstupních dat.
    if (!userId || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 }
      );
    }

    // Načteme token a základní URL z environment proměnných.
    const moodleToken = process.env.MOODLE_TOKEN;
    const moodleBaseUrl =
      process.env.MOODLE_BASE_URL ||
      "https://academy.offtrader.ru/webservice/rest/server.php";

    if (!moodleToken) {
      return NextResponse.json(
        { error: "Moodle token is not set" },
        { status: 500 }
      );
    }

    // Definice funkce a sestavení URL s parametry.
    const wsFunction = "core_user_update_users";
    const url = `${moodleBaseUrl}?wsfunction=${wsFunction}&wstoken=${moodleToken}&moodlewsrestformat=json`;
    console.log("Moodle API URL:", url);

    // Vytvoříme payload ve formátu URL-encoded.
    const formData = new URLSearchParams();
    formData.append("users[0][id]", userId);
    formData.append("users[0][password]", newPassword);
    console.log("Payload for Moodle update:", formData.toString());

    // Provedeme POST požadavek do Moodle.
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    });

    const data = await response.json();
    console.log("Response from Moodle API:", data);

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || "Failed to update password" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      message: "Password updated successfully",
      data,
    });
  } catch (error: any) {
    console.error("Error in change password API:", error);
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}