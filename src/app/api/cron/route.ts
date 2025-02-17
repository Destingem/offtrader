import { NextResponse } from "next/server";
import { Query, Client, Databases, Users } from "node-appwrite";

// Types
type SubscriptionPlan = 'basic' | 'pro' | 'elite';
type CohortMap = Record<SubscriptionPlan, string>;

// Type guard
function isValidPlan(plan: string): plan is SubscriptionPlan {
  return ['basic', 'pro', 'elite'].includes(plan);
}

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
  .setKey(process.env.APPWRITE_API_KEY!);

const databases = new Databases(client);
const users = new Users(client);

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
const SUBSCRIPTION_COLLECTION = process.env.APPWRITE_COLLECTION_ID;
const MOODLE_TOKEN = process.env.MOODLE_TOKEN;
const MOODLE_BASE_URL = "https://academy.offtrader.ru/webservice/rest/server.php";

const COHORTS: CohortMap = {
  basic: "1",
  pro: "2",
  elite: "3",
};

async function getMoodleUserId(email: string): Promise<string | null> {
  const searchUrl = `${MOODLE_BASE_URL}?wsfunction=core_user_get_users_by_field&wstoken=${MOODLE_TOKEN}&moodlewsrestformat=json`;
  const formData = new URLSearchParams();
  formData.append("field", "email");
  formData.append("values[0]", email);

  const response = await fetch(searchUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData.toString(),
  });
  
  const data = await response.json();
  return (!response.ok || !Array.isArray(data) || data.length === 0) ? null : data[0].id;
}

async function getMoodleUserById(moodleUserId: string): Promise<{ email: string } | null> {
  const userUrl = `${MOODLE_BASE_URL}?wsfunction=core_user_get_users_by_field&wstoken=${MOODLE_TOKEN}&moodlewsrestformat=json&field=id&values[0]=${moodleUserId}`;
  const response = await fetch(userUrl);
  const data = await response.json();
  return data[0] || null;
}

async function getAllCohortMembers(): Promise<Map<string, string[]>> {
  const cohortMembers = new Map<string, string[]>();
  
  for (const cohortId of Object.values(COHORTS)) {
    const getMembersUrl = `${MOODLE_BASE_URL}?wsfunction=core_cohort_get_cohort_members&wstoken=${MOODLE_TOKEN}&moodlewsrestformat=json`;
    const formData = new URLSearchParams();
    formData.append("cohortids[0]", cohortId);
    
    const response = await fetch(getMembersUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    });
    
    const data = await response.json();
    if (Array.isArray(data)) {
      for (const cohort of data) {
        for (const userId of cohort.userids) {
          const existing = cohortMembers.get(userId) || [];
          if (!existing.includes(cohortId)) {
            cohortMembers.set(userId, [...existing, cohortId]);
          }
        }
      }
    }
  }
  
  return cohortMembers;
}

async function removeExpiredSubscriptions(): Promise<string[]> {
  const now = new Date().toISOString();
  const expiredSubscriptions = await databases.listDocuments(
    DATABASE_ID!,
    SUBSCRIPTION_COLLECTION!,
    [
      Query.equal("subscriptionStatus", "active"),
      Query.lessThan("subscriptionExpiresAt", now)
    ]
  );

  const expiredIds = [];
  for (const subscription of expiredSubscriptions.documents) {
    await databases.deleteDocument(DATABASE_ID!, SUBSCRIPTION_COLLECTION!, subscription.$id);
    expiredIds.push(subscription.$id);
  }
  
  return expiredIds;
}

async function removeMemberFromCohort(moodleUserId: string, cohortId: string) {
  const removeParams = new URLSearchParams();
  removeParams.append("members[0][cohortid]", cohortId);
  removeParams.append("members[0][userid]", moodleUserId);

  const response = await fetch(
    `${MOODLE_BASE_URL}?wsfunction=core_cohort_delete_cohort_members&wstoken=${MOODLE_TOKEN}&moodlewsrestformat=json`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: removeParams.toString(),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to remove member from cohort: ${response.statusText}`);
  }
}

async function addMemberToCohort(moodleUserId: string, cohortId: string) {
  const formData = new URLSearchParams();
  formData.append("members[0][cohorttype][type]", "id");
  formData.append("members[0][cohorttype][value]", cohortId);
  formData.append("members[0][usertype][type]", "id");
  formData.append("members[0][usertype][value]", moodleUserId);

  const response = await fetch(
    `${MOODLE_BASE_URL}?wsfunction=core_cohort_add_cohort_members&wstoken=${MOODLE_TOKEN}&moodlewsrestformat=json`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    }
  );

  const data = await response.json();
  if (data.exception || data.error) {
    throw new Error(data.message || data.error);
  }
}

async function syncMoodleCohorts() {
  console.log("Getting all Moodle cohort members...");
  const cohortMembers = await getAllCohortMembers();
  
  console.log("Getting active subscriptions from Appwrite...");
  const activeSubscriptions = await databases.listDocuments(
    DATABASE_ID!,
    SUBSCRIPTION_COLLECTION!,
    [Query.equal("subscriptionStatus", "active")]
  );

  console.log(`Processing ${activeSubscriptions.documents.length} active subscriptions...`);
  
  // First process all active subscriptions to ensure users are in correct cohorts
  for (const subscription of activeSubscriptions.documents) {
    try {
      const plan = subscription.subscriptionPlan.toLowerCase();
      if (!isValidPlan(plan)) continue;

      const appwriteUser = await users.get(subscription.$id);
      const moodleUserId = await getMoodleUserId(appwriteUser.email);
      
      if (!moodleUserId) {
        console.log(`No Moodle user found for ${appwriteUser.email}`);
        continue;
      }

      const correctCohortId = COHORTS[plan];
      const currentCohorts = cohortMembers.get(moodleUserId) || [];

      // Remove from incorrect cohorts
      for (const cohortId of currentCohorts) {
        if (cohortId !== correctCohortId) {
          await removeMemberFromCohort(moodleUserId, cohortId);
        }
      }

      // Add to correct cohort if needed
      if (!currentCohorts.includes(correctCohortId)) {
        console.log(`Adding ${appwriteUser.email} to cohort ${correctCohortId}`);
        await addMemberToCohort(moodleUserId, correctCohortId);
      }
    } catch (error) {
      console.error('Error processing subscription:', error);
      continue;
    }
  }

  // Then clean up Moodle users without active subscriptions
  console.log(`Cleaning up ${cohortMembers.size} Moodle users...`);
  for (const [moodleUserId, currentCohorts] of cohortMembers.entries()) {
    try {
      const moodleUser = await getMoodleUserById(moodleUserId);
      if (!moodleUser?.email) continue;

      const appwriteUsers = await users.list([Query.equal("email", moodleUser.email)]);
      const appwriteUser = appwriteUsers.users[0];
      
      if (!appwriteUser) {
        console.log(`Removing ${moodleUser.email} - no Appwrite user found`);
        for (const cohortId of currentCohorts) {
          await removeMemberFromCohort(moodleUserId, cohortId);
        }
        continue;
      }

      // Check if user has active subscription
      const hasActiveSubscription = activeSubscriptions.documents.some(
        sub => sub.$id === appwriteUser.$id
      );

      if (!hasActiveSubscription) {
        console.log(`Removing ${moodleUser.email} - no active subscription`);
        for (const cohortId of currentCohorts) {
          await removeMemberFromCohort(moodleUserId, cohortId);
        }
      }
    } catch (error) {
      console.error(`Error processing Moodle user ${moodleUserId}:`, error);
      continue;
    }
  }
}

export async function GET(request: Request) {
  try {
    console.log("Starting membership sync...");
    
    const expiredIds = await removeExpiredSubscriptions();
    console.log("Removed expired subscriptions:", expiredIds);
    
    await syncMoodleCohorts();
    console.log("Completed Moodle cohort sync");
    
    return NextResponse.json({ 
      success: true,
      expiredSubscriptions: expiredIds
    });
  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
}