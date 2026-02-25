"use client";

import { useRouter, useParams } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Shield, User, Loader2 } from "lucide-react";

interface AdminModeToggleProps {
  applicationId?: string;
  highlight?: boolean;
}

export function AdminModeToggle({ applicationId, highlight }: AdminModeToggleProps) {
  const router = useRouter();
  const params = useParams();

  const appId = applicationId || (params.id as string);

  const { data: roleData } = trpc.admin.getUserRole.useQuery(
    undefined,
    { enabled: !!appId }
  );

  const { data: appData } = trpc.application.getApplicationById.useQuery(
    { applicationId: appId! },
    { enabled: !!appId }
  );

  const utils = trpc.useUtils();

  const toggleMutation = trpc.admin.toggleAdminMode.useMutation({
    onSuccess: (data) => {
      const nextRole = data.role === "admin_simulated" ? "admin_simulated" : "user";
      utils.admin.getUserRole.setData(undefined, {
        role: nextRole,
        hackathonMode: nextRole === "admin_simulated",
      });
      if (nextRole === "admin_simulated") {
        router.replace(`/dashboard/admin?applicationId=${appId}`);
      } else {
        const currentStage = appData?.application.currentStage || "essay";
        router.replace(`/dashboard/application/${appId}/${currentStage}`);
      }
    },
  });

  const handleToggle = async () => {
    if (!appId || toggleMutation.isPending) return;
    const enable = roleData?.role !== "admin_simulated";
    try {
      await toggleMutation.mutateAsync({ enable });
    } catch (error) {
      console.error("Error toggling admin mode:", error);
    }
  };

  const isAdminMode = roleData?.role === "admin_simulated";
  const isLoading = toggleMutation.isPending;
  const highlightClass =
    highlight && !isAdminMode && !isLoading
      ? "ring-2 ring-amber-400/80 shadow-sm shadow-amber-500/30 animate-pulse"
      : "";

  if (!roleData) {
    return null;
  }

  return (
    <Button
      variant={isAdminMode ? "default" : "outline"}
      size="sm"
      onClick={handleToggle}
      disabled={isLoading}
      className={`gap-2 ${highlightClass} ${isAdminMode ? "bg-purple-600 hover:bg-purple-700" : ""}`}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isAdminMode ? (
        <User className="h-4 w-4" />
      ) : (
        <Shield className="h-4 w-4" />
      )}
      {isAdminMode ? "Return to User Mode" : "Switch to Admin Mode"}
    </Button>
  );
}
