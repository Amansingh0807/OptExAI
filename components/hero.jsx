"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PricingPlan, pricingPlan } from "@/lib/pricingplan";
import { useRouter } from "next/navigation";
import { getStripe } from "@/lib/stripe-client"; // ✅ Ensure this path is correct

// type Props = {
//   userId: string | undefined;
// };

const HeroSection = ({ userId }) => {
  const router = useRouter();
  const imageRef = useRef(null);

  useEffect(() => {
    const imageElement = imageRef.current;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      if (imageElement) {
        if (scrollPosition > scrollThreshold) {
          imageElement.classList.add("scrolled");
        } else {
          imageElement.classList.remove("scrolled");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const checkoutHandler = async (price, plan) => {
    if (!userId) {
      router.push("/sign-in");
      return;
    }

    if (price === 0) {
      // Free plan logic can be added here
      return;
    }

    try {
      const res = await fetch("/api/stripe/checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ price, userId, plan }),
      });

      const { sessionId } = await res.json();

      const stripe = await getStripe();
      stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error("Stripe checkout error:", error);
    }
  };

  return (
    <section
      ref={imageRef}
      className="pt-40 pb-20 px-4 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-black dark:text-white relative overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/30 dark:bg-blue-800/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-200/30 dark:bg-purple-800/30 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-pink-200/30 dark:bg-pink-800/30 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>
      
      <div className="container mx-auto text-center relative z-10">
        <h1 className="text-5xl md:text-6xl lg:text-[105px] pb-6 gradient-title transform transition-all duration-1000 hover:scale-105">
          Optimize Your Financial Decisions
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
          An AI-powered financial management platform that helps you track,
          analyze, and optimize your spending with real-time insights and smart recommendations.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
          <Link href="/dashboard">
            <Button size="lg" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-none shadow-2xl hover:shadow-3xl transform transition-all duration-300 hover:scale-110 hover:-translate-y-2 rounded-full font-semibold">
              Get Started Free
              <span className="ml-2">🚀</span>
            </Button>
          </Link>
          <Link href="/">
            <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 py-4 border-2 border-gray-300 dark:border-gray-600 hover:border-purple-500 dark:hover:border-purple-400 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 rounded-full font-semibold">
              Watch Demo
              <span className="ml-2">📺</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Centered Pricing Section */}
      <div className="flex flex-col items-center mt-10">
        <h1 className="font-extrabold text-3xl">Explore Our Plans and Pricing Options</h1>
        <p className="text-gray-500 text-center">
          Maximize Your Savings with Early Payments and Unlimited Credits
        </p>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
          {pricingPlan.map((plan) => (
            <div
              className="relative group transition-all duration-300"
              key={plan.level}
            >
              <div
                className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-600 blur-2xl opacity-50 -z-10 
                rounded-xl group-hover:opacity-70 transition-opacity duration-300"
              ></div>

              <Card
                className={`w-full max-w-sm flex flex-col justify-between transition-transform duration-300 
                group-hover:scale-105 shadow-xl 
                ${plan.level === "Enterprise" && "bg-[#1c1c1c] text-white"}`}
              >
                <CardHeader className="flex flex-row items-center gap-2">
                  <CardTitle>{plan.level}</CardTitle>
                  {plan.level === "Pro" && (
                    <Badge className="text text-center">🚨 Popular</Badge>
                  )}
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-2xl font-bold">{plan.price}</p>
                  <ul className="mt-4 space-y-2">
                    {plan.services.map((item, idx) => (
                      <li className="flex items-center" key={`${item}-${idx}`}>
                        <span className="text-green-500 mr-2">✔️</span> {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    variant={`${
                      plan.level === "Enterprise" ? "default" : "outline"
                    }`}
                    className={`${
                      plan.level === "Enterprise" && "text-black bg-white"
                    } w-full`}
                    onClick={() =>
                      checkoutHandler(
                        plan.level === "Pro"
                          ? 29
                          : plan.level === "Enterprise"
                          ? 70
                          : 0,
                        plan.level
                      )
                    }
                  >
                    Get started with {plan.level}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
