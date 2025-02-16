import { Client, Account, ID } from "appwrite";

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('67ac9b5c00398cc2f3fe');

const account = new Account(client);

// Silently handle initial session check
account.get().catch(() => {});

export { client, account, ID };