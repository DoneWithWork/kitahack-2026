"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc/client";
import Link from "next/link";
import { useState } from "react";

export default function ProfilePage() {
  const profileQuery = trpc.profile.get.useQuery();
  const updateMutation = trpc.profile.update.useMutation();

  const [formData, setFormData] = useState({
    name: "",
    citizenship: "",
    incomeBracket: "medium" as "low" | "medium" | "high",
    interests: "" as string,
    goals: "",
  });

  const handleUpdate = async () => {
    await updateMutation.mutateAsync({
      name: formData.name,
      incomeBracket: formData.incomeBracket,
      interests: formData.interests
        .split(",")
        .map((i) => i.trim())
        .filter(Boolean),
      goals: formData.goals,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold">Profile</h1>
          <nav className="flex gap-4">
            <Link href="/">
              <Button variant="ghost">Home</Button>
            </Link>
            <Link href="/dashboard/scholarships">
              <Button variant="ghost">Dashboard</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>
                Complete your profile to get better scholarship matches
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {profileQuery.data ? (
                <div className="space-y-4">
                  <div>
                    <Label>Email</Label>
                    <Input
                      value={profileQuery.data.email}
                      disabled
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name || profileQuery.data.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="income">Income Bracket</Label>
                    <select
                      id="income"
                      value={
                        formData.incomeBracket ||
                        profileQuery.data.incomeBracket ||
                        "medium"
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          incomeBracket: e.target.value as
                            | "low"
                            | "medium"
                            | "high",
                        })
                      }
                      className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2"
                    >
                      <option value="low">Low Income</option>
                      <option value="medium">Middle Income</option>
                      <option value="high">High Income</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="interests">
                      Interests (comma-separated)
                    </Label>
                    <Input
                      id="interests"
                      value={
                        formData.interests ||
                        profileQuery.data.interests?.join(", ") ||
                        ""
                      }
                      onChange={(e) =>
                        setFormData({ ...formData, interests: e.target.value })
                      }
                      placeholder="e.g., Computer Science, Engineering, Medicine"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="goals">Career Goals</Label>
                    <textarea
                      id="goals"
                      value={formData.goals || profileQuery.data.goals || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, goals: e.target.value })
                      }
                      placeholder="Describe your career aspirations..."
                      className="mt-2 w-full min-h-25 rounded-md border border-input bg-background px-3 py-2"
                    />
                  </div>
                  <Button
                    onClick={handleUpdate}
                    disabled={updateMutation.isPending}
                    className="w-full"
                  >
                    {updateMutation.isPending ? "Saving..." : "Save Profile"}
                  </Button>
                </div>
              ) : (
                <p className="text-center text-muted-foreground">
                  Loading profile...
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
