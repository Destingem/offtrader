{/*"use client";

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { account, client, ID } from '@/lib/appwriteClient';

export default function PaymentSuccessfulPage() {
    const searchParams = useSearchParams();
    const paymentId = searchParams.get('id');
    const { user, refreshUser } = useAuth();

    useEffect(() => {
        const updateMembership = async () => {
            if (!paymentId || !user) return;

            try {
                // Fetch payment details from YooKassa to verify success
                const endpoint = `${process.env.YOOKASSA_ENDPOINT}/${paymentId}`;
                const shopId = process.env.YOOKASSA_SHOP_ID;
                const secretKey = process.env.YOOKASSA_SECRET_KEY;
                const auth = Buffer.from(`${shopId}:${secretKey}`).toString("base64");

                const response = await fetch(endpoint, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Basic ${auth}`,
                    },
                });

                const paymentData = await response.json();

                if (paymentData.status === 'succeeded') {
                    // Determine planId and billingPeriod from payment description or metadata
                    // This is just an example, adjust based on your implementation
                    const planId = paymentData.description.split(' ')[0]; // e.g., "basic"
                    const billingPeriod = paymentData.description.split(' ')[1]; // e.g., "monthly"

                    // Calculate expiry date based on billing period
                    const expiryDate = new Date();
                    if (billingPeriod === 'monthly') {
                        expiryDate.setMonth(expiryDate.getMonth() + 1);
                    } else if (billingPeriod === 'yearly') {
                        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
                    }

                    // Update user document in Appwrite
                    await client.database.updateDocument(
                        'YOUR_DATABASE_ID',
                        'YOUR_COLLECTION_ID',
                        user.$id,
                        {
                            membershipStatus: planId,
                            subscriptionExpiry: expiryDate.getTime(),
                        }
                    );

                    await refreshUser(); // Refresh user context
                } else {
                    console.error('Payment failed:', paymentData);
                }
            } catch (error) {
                console.error('Failed to update membership:', error);
            }
        };

        updateMembership();
    }, [paymentId, user, refreshUser]);

    return (
        <div>
            <h1>Payment Successful</h1>
            <p>Updating your membership...</p>
        </div>
    );
} */}

export default function PaymentSuccessfulPage() {
    return (
        <div>
            <h1>Payment Successful</h1>
            <p>Updating your membership...</p>
        </div>
    );
}