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
  Heart,
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
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: StarsIcon, label: "Scholarships", href: "/dashboard/scholarships" },
  { icon: Heart, label: "Shortlist", href: "/dashboard/shortlist" },
  { icon: Briefcase, label: "Applications", href: "/dashboard/applications" },
  { icon: FileText, label: "Documents", href: "/dashboard/documents" },
  { icon: User, label: "Profile", href: "/dashboard/profile" },
];

function SidebarContent({ pathname }: { pathname: string }) {
  const { signOut } = useAuth();
  const user = auth.currentUser;

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/auth";
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-blue-500">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-foreground">
            ScholarGuide
          </span>
        </Link>
      </div>

      {/* Menu */}
      <ScrollArea className="flex-1 px-4">
        <nav className="flex flex-col">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link key={item.label} href={item.href}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start gap-3 h-11 mb-1 cursor-pointer ${
                    isActive
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
      {/* <ModeToggle /> */}

      <div className="px-4 pt-4 pb-2 mt-auto border-t border-border space-y-4">
        <div className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border-2 border-primary/20">
              <AvatarFallback className="bg-linear-to-br from-blue-500 to-blue-600 text-white text-sm">
                {user?.displayName?.charAt(0) || "S"}
              </AvatarFallback>
            </Avatar>

            <div className="hidden md:block">
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

        <div className="flex items-center justify-between"></div>
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
  const { user, signOut, loading } = useAuth();

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
      <aside className="hidden lg:flex w-72 flex-col bg-card border-r border-border fixed h-screen z-30">
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-72 p-0 bg-card border-border">
          <SidebarContent pathname={pathname} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72">
        {/* Header */}

        {/* Page Content */}
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
