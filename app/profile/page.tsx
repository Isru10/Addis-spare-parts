// src/app/profile/page.tsx
"use client";

import { useActionState, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { updateUserPhone } from "./actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFormStatus } from "react-dom";

// A helper component to show a pending state on the submit button
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save Changes"}
    </Button>
  );
}

export default function ProfilePage() {
  const { data: session, status } = useSession();

  const initialState: { success: boolean; message: string; } = { success: false, message: "" };
  const [state, formAction] = useActionState(updateUserPhone, initialState);
  
  // This useEffect is a placeholder for fetching initial data if needed.
  // For this form, we can rely on the user typing into the input.
  useEffect(() => {
    // Logic to fetch initial phone number could go here if you store it
    // and want to pre-fill the form on first load.
  }, [session]);
  
  if (status === "loading") {
    return <div className="container py-12 text-center">Loading session...</div>;
  }
  
  if (status === "unauthenticated") {
    // While middleware handles this, it's good practice for the component to handle it too.
    return <div className="container py-12 text-center">You must be logged in to view this page.</div>;
  }

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>{session?.user?.name}</CardTitle>
              <CardDescription>{session?.user?.email}</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={formAction} className="space-y-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    // The phone number is not part of the session,
                    // so we expect the user to fill this in.
                  />
                </div>
                <SubmitButton />
                {state.message && (
                  <p className={`text-sm mt-2 ${state.success ? "text-green-600" : "text-red-600"}`}>
                    {state.message}
                  </p>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>A list of your past orders.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Your order history will be displayed here.</p>
              {/* This is where the order history table will go in a future phase */}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}