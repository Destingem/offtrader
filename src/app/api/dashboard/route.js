import { NextResponse } from "next/server"
import { Client, Users, Databases } from "node-appwrite"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 })
    }

    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT)
      .setKey(process.env.APPWRITE_API_KEY)

    const users = new Users(client)
    const databases = new Databases(client)

    // First get user data
    const authUser = await users.get(userId)

    // Then try to get subscription data, handle if not found
    let subscriptionData = {
      subscriptionStatus: 'inactive',
      subscriptionPlan: 'none',
      subscriptionExpiresAt: null,
      balance: 0
    }

    try {
      const dbData = await databases.getDocument(
        process.env.APPWRITE_DATABASE_ID,
        process.env.APPWRITE_COLLECTION_ID,
        userId
      )
      subscriptionData = dbData
    } catch (dbError) {
      // If document not found, we'll use default values
      if (dbError.code !== 404) {
        throw dbError // Re-throw if it's not a 'not found' error
      }
    }

    // Combine the data
    const userData = {
      $id: authUser.$id,
      name: authUser.name,
      email: authUser.email,
      subscriptionStatus: subscriptionData.subscriptionStatus,
      subscriptionPlan: subscriptionData.subscriptionPlan,
      subscriptionExpiresAt: subscriptionData.subscriptionExpiresAt,
      referralLink: `https://offtrader.ru/ref/${authUser.$id}`,
      balance: subscriptionData.balance || 0
    }

    return NextResponse.json(userData)
  } catch (error) {
    console.error('API Error:', {
      message: error.message,
      code: error.code,
      type: error.type,
      stack: error.stack
    })
    return NextResponse.json(
      { 
        error: error.message || "Failed to fetch user data",
        code: error.code,
        type: error.type 
      },
      { status: error.code || 500 }
    )
  }
}