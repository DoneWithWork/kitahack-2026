"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { useAuth } from "@/components/providers/auth-provider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Bell,
  BookOpen,
  Briefcase,
  CreditCard,
  FileText,
  GraduationCap,
  Heart,
  HelpCircle,
  LayoutDashboard,
  Loader2,
  Lock,
  LogOut,
  Menu,
  Search,
  Settings,
  User,
  Users,
  Video,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: User, label: "Profile", href: "/dashboard/profile" },
  { icon: FileText, label: "Documents", href: "/dashboard/documents" },
  { icon: Heart, label: "Shortlist", href: "/dashboard/shortlist" },
  { icon: Briefcase, label: "Applications", href: "/dashboard/applications" },
  { icon: Video, label: "Meet", href: "/dashboard/meet" },
  { icon: CreditCard, label: "Transactions", href: "/dashboard/transactions" },
  { icon: Users, label: "Refer & Earn", href: "/dashboard/refer" },
  { icon: Lock, label: "Privacy", href: "/dashboard/privacy" },
  { icon: BookOpen, label: "Article", href: "/dashboard/articles" },
  { icon: HelpCircle, label: "FAQ", href: "/dashboard/faq" },
];

function SidebarContent({ pathname }: { pathname: string }) {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/auth";
  };

  return (
    <>
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

      <ScrollArea className="flex-1 px-4">
        <nav className="space-y-1">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.label} href={item.href}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start gap-3 h-11 mb-1 ${
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

      <div className="p-4 mt-auto">
        <Separator className="mb-4" />

        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
          onClick={handleSignOut}
        >
          <LogOut className="h-5 w-5" />
          Log Out
        </Button>
      </div>
    </>
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
        <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-border">
          <div className="flex items-center justify-between h-16 px-4 lg:px-8">
            <div className="flex items-center gap-4">
              <Sheet>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5 text-muted-foreground" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="w-72 p-0 bg-card border-border"
                >
                  <SidebarContent pathname={pathname} />
                </SheetContent>
              </Sheet>

              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search scholarships, universities..."
                  className="pl-10 w-80 bg-muted border-border text-foreground"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <ModeToggle />

              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
              </Button>

              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5 text-muted-foreground" />
              </Button>

              <div className="flex items-center gap-3 pl-4 border-l border-border">
                <div className="text-right hidden md:block">
                  <p className="text-sm font-medium text-foreground">
                    {user?.displayName || "Student"}
                  </p>
                  <p className="text-xs text-muted-foreground">Student</p>
                </div>
                <Avatar className="h-9 w-9 border-2 border-primary/20">
                  <AvatarFallback className="bg-linear-to-br from-blue-500 to-blue-600 text-white text-sm">
                    {user?.displayName?.charAt(0) || "S"}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
