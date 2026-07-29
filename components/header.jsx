"use server"
import React from "react";
import { Button } from "./ui/button";
import { PenBox, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { checkUser } from "@/lib/checkUser";
import { DarkMode } from "@/components/DarkMode";
import { CurrencyWrapper } from "@/components/CurrencyWrapper";
import { getUserCurrency } from "@/actions/currency";

const Header = async () => {
  try {
    await checkUser();
  } catch (error) {
    console.error("Error in Header:", error.message);
  }

  const { currency } = await getUserCurrency();

  return (
    <header className="fixed top-0 w-full bg-background z-50 border-b border-border">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="cursor-pointer">
          <span className="font-playfair text-3xl font-black tracking-tighter">OPTEX.</span>
        </Link>

        {/* Navigation Links - Different for signed in/out users */}
        <div className="hidden md:flex items-center space-x-8 font-mono text-sm uppercase tracking-widest nav-stagger">
          <SignedOut>
            <a href="#features" className="text-foreground/80 hover:text-primary snappy-hover cursor-pointer py-1">
              Features
            </a>
            <a href="#testimonials" className="text-foreground/80 hover:text-primary snappy-hover cursor-pointer py-1">
              Testimonials
            </a>
          </SignedOut>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          <SignedIn>
            <Link href="/dashboard" className="cursor-pointer">
              <Button variant="outline" className="rounded-none border-border hover:bg-foreground hover:text-background snappy-transition">
                <LayoutDashboard size={16} className="mr-2" />
                <span className="hidden md:inline font-mono uppercase text-xs tracking-wider">Dashboard</span>
              </Button>
            </Link>
            <a href="/transaction/create" className="cursor-pointer">
              <Button className="rounded-none bg-primary text-primary-foreground hover:bg-foreground hover:text-background snappy-transition">
                <PenBox size={16} className="mr-2" />
                <span className="hidden md:inline font-mono uppercase text-xs tracking-wider">Add Transaction</span>
              </Button>
            </a>
            <CurrencyWrapper currentCurrency={currency} />
            <DarkMode />
          </SignedIn>
          <SignedOut>
            <DarkMode />
            <SignInButton forceRedirectUrl="/dashboard">
              <Button variant="ghost" className="rounded-none font-mono uppercase text-xs tracking-wider hover:bg-foreground hover:text-background snappy-transition">
                Login
              </Button>
            </SignInButton>
            <SignUpButton forceRedirectUrl="/dashboard">
              <Button className="rounded-none bg-primary text-primary-foreground hover:bg-foreground hover:text-background snappy-transition font-mono uppercase text-xs tracking-wider">
                Sign Up
              </Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-9 h-9 rounded-none border border-border transition-all duration-150 hover:border-primary",
                },
              }}
            />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
};

export default Header;