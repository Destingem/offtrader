// /api/register/route.js
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    console.log("Processing Moodle registration request...");
    const { email, password, name } = await request.json();
    console.log("Received data:", { email, password: "********", name });
    
    if (!email || !password || !name) {
      console.error("Missing required fields");
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Rozdělení jména na firstname a lastname
    const nameParts = name.trim().split(" ");
    const firstname = nameParts[0];
    const lastname = nameParts.slice(1).join(" ") || " ";
    console.log("Parsed name:", { firstname, lastname });

    // Načtení tokenu z environment proměnných
    const moodleToken = process.env.MOODLE_TOKEN;
    // Správná URL k Moodle REST API
    const moodleBaseUrl = "https://academy.offtrader.ru/webservice/rest/server.php";
    const wsFunction = "core_user_create_users";
    const url = `${moodleBaseUrl}?wsfunction=${wsFunction}&wstoken=${moodleToken}&moodlewsrestformat=json`;
    console.log("Moodle API URL:", url);

    // Převod payloadu do URL-encoded formátu
    const formData = new URLSearchParams();
    formData.append("users[0][username]", email);
    formData.append("users[0][password]", password);
    formData.append("users[0][firstname]", firstname);
    formData.append("users[0][lastname]", lastname);
    formData.append("users[0][email]", email);
    formData.append("users[0][auth]", "manual");

    console.log("Payload for Moodle registration (URL encoded):", formData.toString());

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString()
    });
    
    const responseClone = response.clone();
    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      const text = await responseClone.text();
      console.error("Error parsing JSON, response text:", text);
      throw new Error("Failed to parse JSON from Moodle API: " + text);
    }
    
    console.log("Response from Moodle API:", data);

    if (!response.ok) {
      console.error("Failed to create Moodle user:", data);
      return NextResponse.json({ error: data.error || "Failed to create Moodle user" }, { status: response.status });
    }

    console.log("Moodle user created successfully");
    return NextResponse.json({ message: "Moodle user created", data });
  } catch (error) {
    console.error("Error in Moodle registration endpoint:", error);
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}