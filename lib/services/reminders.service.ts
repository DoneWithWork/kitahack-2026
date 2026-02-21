import type { Application } from "@/lib/schemas/ai.schema";
import { daysUntil, isOverdue } from "@/lib/utils/dates";

export interface Reminder {
  type: "deadline" | "checklist";
  priority: "high" | "medium" | "low";
  message: string;
  scholarshipId: string;
  daysLeft?: number;
}

export const generateReminders = (applications: Application[]): Reminder[] => {
  const reminders: Reminder[] = [];

  for (const app of applications) {
    const days = daysUntil(app.deadline);

    if (isOverdue(app.deadline)) {
      reminders.push({
        type: "deadline",
        priority: "high",
        message: `Deadline passed for application`,
        scholarshipId: app.scholarshipId,
        daysLeft: days,
      });
    } else if (days <= 3) {
      reminders.push({
        type: "deadline",
        priority: "high",
        message: `Deadline in ${days} day${days !== 1 ? "s" : ""}`,
        scholarshipId: app.scholarshipId,
        daysLeft: days,
      });
    } else if (days <= 7) {
      reminders.push({
        type: "deadline",
        priority: "medium",
        message: `Deadline in ${days} days`,
        scholarshipId: app.scholarshipId,
        daysLeft: days,
      });
    }

    const incompleteItems = app.checklist.filter((item) => !item.completed);
    if (incompleteItems.length > 0 && days <= 7) {
      reminders.push({
        type: "checklist",
        priority: days <= 3 ? "high" : "medium",
        message: `${incompleteItems.length} checklist item${
          incompleteItems.length !== 1 ? "s" : ""
        } incomplete`,
        scholarshipId: app.scholarshipId,
      });
    }
  }

  return reminders.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
};

export const generateChecklist = (
  _scholarshipDescription: string,
): string[] => {
  return [
    "Complete application form",
    "Prepare transcript",
    "Write personal statement",
    "Get recommendation letters",
    "Submit before deadline",
  ];
};
