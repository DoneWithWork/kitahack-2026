export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toISOString().split("T")[0];
};

export const formatDateTime = (date: string | Date): string => {
  const d = new Date(date);
  return d.toISOString().replace("T", " ").slice(0, 19);
};

export const isOverdue = (deadline: string | Date): boolean => {
  return new Date() > new Date(deadline);
};

export const daysUntil = (deadline: string | Date): number => {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const addDays = (date: string | Date, days: number): Date => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

export const now = (): string => {
  return new Date().toISOString();
};
