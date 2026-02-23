"use client";

import { useRouter, useParams } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Shield, User, Loader2 } from "lucide-react";
import { useState } from "react";

interface AdminModeToggleProps {
  applicationId?: string;
}

export function AdminModeToggle({ applicationId }: AdminModeToggleProps) {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const appId = applicationId || (params.id as string);

  const { data: roleData, refetch: refetchRole } = trpc.admin.getUserRole.useQuery(
    undefined,
    { enabled: !!appId }
  );

  const toggleMutation = trpc.admin.toggleAdminMode.useMutation({
    onSuccess: (data) => {
      refetchRole();
      if (data.role === "admin_simulated") {
        router.push(`/dashboard/admin?applicationId=${appId}`);
      } else {
        router.push(`/dashboard/application/${appId}/essay`);
      }
    },
    onError: () => {
      setIsLoading(false);
    },
  });

  const handleToggle = async () => {
    if (!appId) return;
    setIsLoading(true);
    const enable = roleData?.role !== "admin_simulated";
    await toggleMutation.mutateAsync({ enable });
  };

  const isAdminMode = roleData?.role === "admin_simulated";

  if (!roleData) {
    return null;
  }

  return (
    <Button
      variant={isAdminMode ? "default" : "outline"}
      size="sm"
      onClick={handleToggle}
      disabled={isLoading}
      className={`gap-2 ${isAdminMode ? "bg-purple-600 hover:bg-purple-700" : ""}`}
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
