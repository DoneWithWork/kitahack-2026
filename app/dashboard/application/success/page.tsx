"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Trophy, 
  Gift, 
  ArrowRight, 
  CheckCircle2,
  PartyPopper,
  Sparkles
} from "lucide-react";
import Link from "next/link";

export default function ScholarshipSuccessPage() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8 animate-in fade-in zoom-in duration-700">
        
        {/* Celebration Icon Cluster */}
        <div className="relative inline-block">
          <div className="absolute inset-0 animate-ping rounded-full bg-amber-400/20 blur-2xl" />
          <div className="relative bg-linear-to-b from-amber-400 to-orange-500 p-6 rounded-3xl shadow-2xl shadow-orange-500/20">
            <Trophy className="h-20 w-20 text-white" />
          </div>
          <Sparkles className="absolute -top-4 -right-4 h-8 w-8 text-amber-500 animate-pulse" />
          <PartyPopper className="absolute -bottom-2 -left-6 h-8 w-8 text-orange-500 animate-bounce" />
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground bg-clip-text text-transparent bg-linear-to-r from-amber-500 via-orange-600 to-amber-500 animate-pulse">
            YOU DID IT!
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-lg mx-auto leading-relaxed">
            Your hard work has officially paid off. Your scholarship application has been 
            <span className="text-foreground font-bold"> Approved & Claimed</span>.
          </p>
        </div>

        <Card className="border-border/60 bg-muted/30 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-8">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 mx-auto">
                  <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-sm font-semibold">Funds Secured</p>
                <p className="text-xs text-muted-foreground">Allocation confirmed</p>
              </div>
              <div className="space-y-2 border-y md:border-y-0 md:border-x border-border/60 py-4 md:py-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 mx-auto">
                  <Gift className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-sm font-semibold">Next Steps Sent</p>
                <p className="text-xs text-muted-foreground">Check your portal inbox</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 mx-auto">
                  <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <p className="text-sm font-semibold">Future Unlocked</p>
                <p className="text-xs text-muted-foreground">Go change the world</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <Link href="/dashboard/scholarships" className="w-full md:w-auto">
            <Button size="lg" className="rounded-full px-8 py-6 text-lg font-bold bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-xl shadow-orange-500/20 w-full md:w-auto">
              Return to Discovery
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/dashboard/application" className="w-full md:w-auto">
            <Button variant="outline" size="lg" className="rounded-full px-8 py-6 text-lg font-medium border-border/60 hover:bg-muted w-full md:w-auto">
              View All Applications
            </Button>
          </Link>
        </div>

        <p className="text-sm text-muted-foreground pt-8 italic">
          &quot;The future belongs to those who believe in the beauty of their dreams.&quot;
        </p>
      </div>
    </div>
  );
}
