
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Rocket } from "lucide-react";
import {
  featuresData,
  howItWorksData,
  statsData,
  testimonialsData,
} from "@/data/landing";
import HeroSection from "@/components/hero";
import Link from "next/link";
import MoneyConverter from "@/components/MoneyConverter";
import LoanCalculator from "@/components/LoanCalculator";
export const dynamic = "force-dynamic";


const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-gray-100">
      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-teal-900/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {statsData.map((stat, index) => (
              <div key={index} className="text-center group transform transition-all duration-300 hover:scale-110">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-300">
                  {stat.value}
                </div>
                <div className="text-gray-700 dark:text-gray-300 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="flex flex-col lg:flex-row justify-center items-center lg:items-start p-6 space-y-6 lg:space-y-0 lg:space-x-6">
      <div className="w-full max-w-md transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
        <MoneyConverter />
      </div>
      <div className="w-full max-w-md transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
        <LoanCalculator />
      </div>
    </div>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-br from-white via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            All the tools you need to handle your finances
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Discover powerful features designed to simplify your financial management and help you achieve your goals.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuresData.map((feature, index) => (
              <Card className="p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-xl dark:shadow-2xl border border-gray-200/20 dark:border-gray-700/20 hover:shadow-2xl dark:hover:shadow-3xl transform transition-all duration-300 hover:scale-105 hover:-translate-y-2 group" key={index}>
                <CardContent className="space-y-4 pt-4">
                  <div className="transform transition-all duration-300 group-hover:scale-110 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-all duration-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">How It Works</h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-16 max-w-2xl mx-auto">
            Get started with OptEx in just three simple steps and take control of your financial future.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {howItWorksData.map((step, index) => (
              <div key={index} className="text-center group transform transition-all duration-300 hover:scale-105">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-800 dark:to-purple-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl group-hover:from-blue-200 group-hover:to-purple-200 dark:group-hover:from-blue-700 dark:group-hover:to-purple-700 transition-all duration-300">
                  <div className="transform transition-all duration-300 group-hover:scale-110 text-blue-600 dark:text-blue-400">
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-300">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-all duration-300">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gradient-to-br from-white via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/10 dark:to-pink-900/10">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            What Our Users Say
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-16 max-w-2xl mx-auto">
            Join thousands of satisfied users who have transformed their financial lives with OptEx.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonialsData.map((testimonial, index) => (
              <Card key={index} className="p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-xl dark:shadow-2xl border border-gray-200/20 dark:border-gray-700/20 hover:shadow-2xl dark:hover:shadow-3xl transform transition-all duration-300 hover:scale-105 hover:-translate-y-2 group">
                <CardContent className="pt-4">
                  <div className="flex items-center mb-4">
                    <div className="relative">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={48}
                        height={48}
                        className="rounded-full ring-2 ring-purple-200 dark:ring-purple-700 group-hover:ring-purple-400 dark:group-hover:ring-purple-500 transition-all duration-300"
                      />
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                    </div>
                    <div className="ml-4">
                      <div className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-all duration-300">{testimonial.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-all duration-300">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-all duration-300 italic">&ldquo;{testimonial.quote}&rdquo;</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 via-purple-600/90 to-pink-600/90"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full animate-pulse"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full animate-pulse delay-1000"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-bold text-white mb-4 transform transition-all duration-300 hover:scale-105">
            Ready to Take Control of Your Finances?
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto text-lg">
            Join thousands of users who are already managing their finances
            smarter with OptEx
          </p>
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-white text-purple-600 hover:bg-gray-100 hover:text-purple-700 font-semibold px-8 py-4 rounded-full shadow-2xl hover:shadow-3xl transform transition-all duration-300 hover:scale-110 hover:-translate-y-2 animate-bounce"
            >
              Start Free Trial
              <Rocket className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

