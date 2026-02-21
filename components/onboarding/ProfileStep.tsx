import {
  targetFields,
  incomeBrackets,
  commonInterests,
} from "@/lib/onboarding/constants";
import { trpc } from "@/lib/trpc/client";
import { Label } from "@/components/ui/label";

import { GraduationCap, Loader2, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";

const currentYear = new Date().getFullYear();
const graduationYears = Array.from({ length: 6 }, (_, i) => currentYear + i);

export function ProfileStep({
  onNext,
  onBack,
  canGoBack,
}: {
  onNext: () => void;
  onBack: () => void;
  canGoBack: boolean;
}) {
  const [formData, setFormData] = useState({
    currentSchool: "",
    graduationYear: "",
    targetField: "",
    incomeBracket: "",
    interests: [] as string[],
    goals: "",
  });
  const [customInterest, setCustomInterest] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const saveProfile = trpc.onboarding.saveProfile.useMutation();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await saveProfile.mutateAsync({
        currentSchool: formData.currentSchool,

        graduationYear: parseInt(formData.graduationYear, 10),
        targetField: formData.targetField,
        incomeBracket: formData.incomeBracket as "low" | "medium" | "high",
        interests: formData.interests,
        goals: formData.goals,
      });
      onNext();
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const addCustomInterest = () => {
    if (customInterest && !formData.interests.includes(customInterest)) {
      setFormData((prev) => ({
        ...prev,
        interests: [...prev.interests, customInterest],
      }));
      setCustomInterest("");
    }
  };

  return (
    <Card className="border-slate-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-blue-600" />
          Profile Information
        </CardTitle>
        <CardDescription>
          Help us understand your background to find the best scholarship
          matches
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="school">Current School *</Label>
            <Input
              id="school"
              placeholder="e.g., SMJK Kepong, Taylor's International School"
              value={formData.currentSchool}
              onChange={(e) =>
                setFormData({ ...formData, currentSchool: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="graduation">Expected Graduation Year *</Label>
            <Select
              value={formData.graduationYear}
              onValueChange={(value) =>
                setFormData({ ...formData, graduationYear: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {graduationYears.map((year) => (
                  <SelectItem key={year} value={String(year)}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="target">Field You Want to Study *</Label>
            <Select
              value={formData.targetField}
              onValueChange={(value) =>
                setFormData({ ...formData, targetField: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select field of interest" />
              </SelectTrigger>
              <SelectContent>
                {targetFields.map((field) => (
                  <SelectItem key={field.value} value={field.value}>
                    {field.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="income">Household Income Bracket *</Label>
            <Select
              value={formData.incomeBracket}
              onValueChange={(value) =>
                setFormData({ ...formData, incomeBracket: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select income bracket" />
              </SelectTrigger>
              <SelectContent>
                {incomeBrackets.map((bracket) => (
                  <SelectItem key={bracket.value} value={bracket.value}>
                    {bracket.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Extracurricular Activities & Interests *</Label>
          <div className="flex flex-wrap gap-2">
            {formData.interests.map((interest) => (
              <Badge
                key={interest}
                variant="default"
                className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900"
                onClick={() => toggleInterest(interest)}
              >
                {interest}
              </Badge>
            ))}

            {commonInterests
              .filter((i) => !formData.interests.includes(i))
              .map((interest) => (
                <Badge
                  key={interest}
                  variant="outline"
                  className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900"
                  onClick={() => toggleInterest(interest)}
                >
                  {interest}
                </Badge>
              ))}
          </div>
          <div className="flex gap-2 mt-2">
            <Input
              placeholder="Add custom activity or interest"
              value={customInterest}
              onChange={(e) => setCustomInterest(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addCustomInterest()}
            />
            <Button type="button" variant="outline" onClick={addCustomInterest}>
              Add
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="goals">Your Goals & Aspirations *</Label>
          <Textarea
            id="goals"
            placeholder="Tell us about your academic goals, career aspirations, and why you deserve a scholarship..."
            value={formData.goals}
            onChange={(e) =>
              setFormData({ ...formData, goals: e.target.value })
            }
            className="min-h-25"
          />
        </div>

        <div className="flex gap-4 pt-4">
          {canGoBack && (
            <Button variant="outline" onClick={onBack} disabled={isSubmitting}>
              Back
            </Button>
          )}
          <Button
            onClick={handleSubmit}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            disabled={
              !formData.currentSchool ||
              !formData.graduationYear ||
              !formData.targetField ||
              !formData.incomeBracket ||
              formData.interests.length === 0 ||
              !formData.goals ||
              isSubmitting
            }
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <>
                Continue
                <ChevronRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
