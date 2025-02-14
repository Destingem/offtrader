import { Client, Databases } from "node-appwrite";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!) // "https://cloud.appwrite.io/v1"
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)     // Using the variable from your .env.local
  .setKey(process.env.APPWRITE_API_KEY!.trim());             // Remove any extra spaces if needed

const databases = new Databases(client);

export { client, databases };