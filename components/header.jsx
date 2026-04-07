"use server"
import React from "react";
import { Button } from "./ui/button";
import { PenBox, LayoutDashboard } from "lucide-react";
import { PiggyBank  } from 'lucide-react';
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { checkUser } from "@/lib/checkUser";
import Image from "next/image";
import { DarkMode } from "@/components/DarkMode";
import { CurrencyWrapper } from "@/components/CurrencyWrapper";
import { getUserCurrency } from "@/actions/currency";
const Header = async () => {
  try {
    await checkUser();
  } catch (error) {
    console.error("Error in Header:", error.message);
    // Optionally, redirect to login or show an error message
  }

  // Get user's currency preference
  const { currency } = await getUserCurrency();

  return (
    <header className="fixed top-0 w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md z-50 border-b border-gray-200/20 dark:border-gray-700/20 shadow-lg">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="transition-all duration-300 hover:scale-105 cursor-pointer">
          <Image
            src={"/logo.png"}
            alt="OptEx Logo"
            width={250}
            height={100}
            className="h-12 w-auto object-contain filter drop-shadow-lg"
          />
        </Link>

        {/* Navigation Links - Different for signed in/out users */}
        <div className="hidden md:flex items-center space-x-8">
          <SignedOut>
            <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 hover:scale-105 font-medium cursor-pointer">
              Features
            </a>
            <a
              href="#testimonials"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 hover:scale-105 font-medium cursor-pointer"
            >
              Testimonials
            </a>
          </SignedOut>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          <SignedIn>
            <Link
              href="/dashboard"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2 transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              <Button variant="outline" className="transition-all duration-300 hover:shadow-lg">
                <LayoutDashboard size={18} />
                <span className="hidden md:inline">Dashboard</span>
              </Button>
            </Link>
            <a href="/transaction/create" className="cursor-pointer">
              <Button className="flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <PenBox size={18} />
                <span className="hidden md:inline">Add Transaction</span>
              </Button>
            </a>
            <CurrencyWrapper currentCurrency={currency} />
            <DarkMode />
          </SignedIn>
          <SignedOut>
            <DarkMode />
            <SignInButton forceRedirectUrl="/dashboard">
              <Button variant="outline" className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-none hover:from-emerald-600 hover:to-teal-700 shadow-lg hover:shadow-emerald-500/40 transition-all duration-300 hover:scale-105">
                Login
              </Button>
            </SignInButton>
            <SignUpButton forceRedirectUrl="/dashboard">
              <Button variant="outline" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/20 hover:border-emerald-500 shadow-sm transition-all duration-300 hover:scale-105">
                Sign Up
              </Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10 ring-2 ring-blue-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-900 transition-all duration-300 hover:ring-purple-500",
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