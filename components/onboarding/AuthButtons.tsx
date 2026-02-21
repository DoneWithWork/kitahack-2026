"use client";
import { auth } from "@/lib/firebase/client";
import Link from "next/link";
import { Button } from "../ui/button";

const AuthButtons = () => {
  return (
    <>
      {auth.currentUser ? (
        <Link href="/dashboard">
          <Button
            variant="outline"
            className="text-muted-foreground hover:text-primary"
          >
            Dashboard
          </Button>
        </Link>
      ) : (
        <>
          <Link href="/auth" className="hidden md:block">
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-primary"
            >
              Sign In
            </Button>
          </Link>
          <Link href="/auth">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
              Get Started Free
            </Button>
          </Link>
        </>
      )}
    </>
  );
};

export default AuthButtons;
