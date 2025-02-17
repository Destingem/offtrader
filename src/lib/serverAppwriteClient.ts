import { Client, Databases, Users } from "node-appwrite";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!) // "https://cloud.appwrite.io/v1"
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)     // Používá proměnnou z .env.local
  .setKey(process.env.APPWRITE_API_KEY!.trim());             // Odstraní případné přebytečné mezery

const databases = new Databases(client);
const users = new Users(client);

export async function getAppwriteUserEmail(userId: string): Promise<string | null> {
  try {
    const user = await users.get(userId);
    return user.email;
  } catch (error) {
    console.error("Error getting Appwrite user email:", error);
    return null;
  }
}

export { client, databases };