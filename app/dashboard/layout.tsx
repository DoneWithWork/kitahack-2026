"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { auth } from "@/lib/firebase/client";
import {
  Briefcase,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Loader2,
  LogOut,
  StarsIcon,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const sidebarItems = [
  { icon: StarsIcon, label: "Scholarships", href: "/dashboard/scholarships" },
  { icon: Briefcase, label: "Applications", href: "/dashboard/application" },
  { icon: FileText, label: "Documents", href: "/dashboard/documents" },
  { icon: User, label: "Profile", href: "/dashboard/profile" },
];

function SidebarContent({
  pathname,
  compact = false,
}: {
  pathname: string;
  compact?: boolean;
}) {
  const { signOut } = useAuth();
  const user = auth.currentUser;

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/auth";
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-3 pt-5 pb-4">
        <Link
          href="/"
          className={`flex items-center ${compact ? "justify-center" : "gap-2"}`}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-blue-500">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          {!compact && (
            <span className="text-xl font-bold text-foreground">
              ScholarGuide
            </span>
          )}
        </Link>
      </div>

      {/* Menu */}
      <ScrollArea className={`flex-1 ${compact ? "px-2" : "px-4"}`}>
        <nav
          className={`flex flex-col ${compact ? "items-center gap-2" : ""}`}
        >
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link key={item.label} href={item.href}>
                <Button
                  variant="ghost"
                  size={compact ? "icon-lg" : "default"}
                  className={
                    compact
                      ? `group relative h-11 w-11 cursor-pointer ${
                          isActive
                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`
                      : `w-full justify-start gap-3 h-11 mb-1 cursor-pointer ${
                          isActive
                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`
                  }
                >
                  <item.icon className="h-5 w-5" />
                  {compact ? (
                    <span className="pointer-events-none absolute left-14 top-1/2 -translate-y-1/2 rounded-md border border-border bg-popover px-2 py-1 text-xs text-popover-foreground opacity-0 shadow-sm transition group-hover:opacity-100">
                      {item.label}
                    </span>
                  ) : (
                    item.label
                  )}
                </Button>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
      {/* <ModeToggle /> */}

      <div
        className={`pt-4 pb-3 mt-auto border-t border-border ${
          compact ? "px-3" : "px-4"
        }`}
      >
        {compact ? (
          <div className="flex flex-col items-center gap-2">
            <div className="group relative">
              <Avatar className="h-9 w-9 border-2 border-primary/20">
                <AvatarFallback className="bg-linear-to-br from-blue-500 to-blue-600 text-white text-sm">
                  {user?.displayName?.charAt(0) || "S"}
                </AvatarFallback>
              </Avatar>
              <span className="pointer-events-none absolute left-12 top-1/2 -translate-y-1/2 rounded-md border border-border bg-popover px-2 py-1 text-xs text-popover-foreground opacity-0 shadow-sm transition group-hover:opacity-100">
                {user?.displayName || "Student"}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9 border-2 border-primary/20">
                <AvatarFallback className="bg-linear-to-br from-blue-500 to-blue-600 text-white text-sm">
                  {user?.displayName?.charAt(0) || "S"}
                </AvatarFallback>
              </Avatar>

              <div>
                <p className="text-sm font-medium text-foreground">
                  {user?.displayName || "Student"}
                </p>
                <p className="text-xs text-muted-foreground">Student</p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-16 flex-col bg-card border-r border-border fixed h-screen z-30">
        <SidebarContent pathname={pathname} compact />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-72 p-0 bg-card border-border">
          <SidebarContent pathname={pathname} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 lg:ml-16">
        {/* Header */}

        {/* Page Content */}
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
