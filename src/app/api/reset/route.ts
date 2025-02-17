// /api/moodle/change-password/route.ts
import { NextResponse } from "next/server";
import { getAppwriteUserEmail } from "@/lib/serverAppwriteClient";

export async function POST(request: Request) {
  try {
    console.log("Received request to change Moodle password");
    const body = await request.json();
    console.log("Request body:", body);
    // Očekáváme userId (Appwrite id), newPassword a confirmPassword.
    const { userId, newPassword, confirmPassword } = body;

    if (!userId || !newPassword || !confirmPassword) {
      console.error("Missing required fields", { userId, newPassword, confirmPassword });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    if (newPassword !== confirmPassword) {
      console.error("Passwords do not match", { newPassword, confirmPassword });
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 }
      );
    }

    // 1. Získáme e-mail uživatele z Appwrite pomocí userId.
    console.log(`Fetching Appwrite user email for userId: ${userId}`);
    const email = await getAppwriteUserEmail(userId);
    console.log("Fetched Appwrite user email:", email);
    if (!email) {
      console.error("Appwrite user not found", { userId });
      return NextResponse.json(
        { error: "Appwrite user not found" },
        { status: 404 }
      );
    }

    // 2. Vyhledání uživatele v Moodle podle e-mailu.
    const moodleToken = process.env.MOODLE_TOKEN;
    const moodleBaseUrl =
      process.env.MOODLE_BASE_URL ||
      "https://academy.offtrader.ru/webservice/rest/server.php";

    if (!moodleToken) {
      console.error("Moodle token is not set");
      return NextResponse.json(
        { error: "Moodle token is not set" },
        { status: 500 }
      );
    }

    const searchFunction = "core_user_get_users_by_field";
    const searchUrl = `${moodleBaseUrl}?wsfunction=${searchFunction}&wstoken=${moodleToken}&moodlewsrestformat=json`;
    const searchFormData = new URLSearchParams();
    searchFormData.append("field", "email");
    searchFormData.append("values[0]", email);
    console.log("Search URL:", searchUrl);
    console.log("Search payload:", searchFormData.toString());

    const searchResponse = await fetch(searchUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: searchFormData.toString(),
    });
    console.log("Search response status:", searchResponse.status);
    const searchData = await searchResponse.json();
    console.log("Search response data:", searchData);

    if (!searchResponse.ok || !Array.isArray(searchData) || searchData.length === 0) {
      console.error("Moodle user not found for email:", email);
      return NextResponse.json(
        { error: "User not found in Moodle" },
        { status: 404 }
      );
    }
    // Interní Moodle user id (číselný).
    const moodleUserId = searchData[0].id;
    console.log("Found Moodle user id:", moodleUserId);

    // 3. Aktualizace hesla v Moodle pomocí funkce core_user_update_users.
    const updateFunction = "core_user_update_users";
    const updateUrl = `${moodleBaseUrl}?wsfunction=${updateFunction}&wstoken=${moodleToken}&moodlewsrestformat=json`;
    const updateFormData = new URLSearchParams();
    updateFormData.append("users[0][id]", moodleUserId.toString());
    updateFormData.append("users[0][password]", newPassword);
    console.log("Update URL:", updateUrl);
    console.log("Update payload:", updateFormData.toString());

    const updateResponse = await fetch(updateUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: updateFormData.toString(),
    });
    console.log("Update response status:", updateResponse.status);
    const updateData = await updateResponse.json();
    console.log("Update response data:", updateData);

    if (!updateResponse.ok) {
      console.error("Failed to update Moodle password", updateData.error);
      return NextResponse.json(
        { error: updateData.error || "Failed to update password in Moodle" },
        { status: updateResponse.status }
      );
    }

    console.log("Password updated successfully in Moodle");
    return NextResponse.json({
      message: "Password updated successfully in Moodle",
      data: updateData,
    });
  } catch (error: any) {
    console.error("Error in Moodle change password API:", error);
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}