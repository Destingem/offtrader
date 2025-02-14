"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { account } from "@/lib/appwriteClient";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const uid = params.get("userId");
    const sec = params.get("secret");
    const expParam = params.get("expire");

    if (!uid || !sec) {
      setError("Invalid recovery link");
    } else {
      setUserId(uid);
      setSecret(sec);
    }

    // Check expiration if provided.
    if (expParam) {
      // Replace '+' with ' ' to correctly parse date string if needed.
      const expString = expParam.replace(/\+/g, " ");
      const expireDate = new Date(expString);
      if (expireDate < new Date()) {
        
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (expired) {
      setError("Recovery link expired");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!userId || !secret) {
      setError("Missing recovery credentials");
      return;
    }

    try {
      await account.updateRecovery(userId, secret, newPassword);
      setSuccess("Password updated successfully. Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Failed to update password");
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>Enter your new password</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={expired}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={expired}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={expired}>
              Reset Password
            </Button>
            <p className="text-sm text-center">
              <Link href="/login" className="text-primary hover:underline">
                Back to Login
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}