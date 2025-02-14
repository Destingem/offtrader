import { Client, Account, ID } from "appwrite";

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')  // Make sure v1 endpoint
    .setProject('67ac9b5c00398cc2f3fe');

const account = new Account(client);

export { client, account, ID };