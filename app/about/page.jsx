"use client";

import Link from "next/link";
import { ArrowRight, Users, Heart, Target, Zap, Shield, TrendingUp, Award, Sparkles, CheckCircle, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Suspense } from "react";

function AboutPageContent() {
  const values = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Mission Driven",
      description: "Empowering individuals to take control of their financial future with intelligent tools.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Privacy First",
      description: "Your financial data is yours. We use bank-level encryption and never sell your information.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "AI-Powered",
      description: "Smart insights and automation that learn from your spending patterns to help you save more.",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "User Focused",
      description: "Built by people who care. Every feature is designed with your financial wellbeing in mind.",
      gradient: "from-green-500 to-emerald-500"
    }
  ];

  const stats = [
    { label: "Active Users", value: "10K+", icon: <Users className="w-6 h-6" /> },
    { label: "Transactions Tracked", value: "50K+", icon: <TrendingUp className="w-6 h-6" /> },
    { label: "Money Saved", value: "$2M+", icon: <Award className="w-6 h-6" /> },
    { label: "Countries", value: "25+", icon: <Globe className="w-6 h-6" /> }
  ];

  const features = [
    "Smart expense tracking with AI categorization",
    "Real-time budget monitoring & alerts",
    "Multi-currency support for global users",
    "Receipt scanning with OCR technology",
    "Voice-powered transaction entry",
    "Detailed analytics & insights"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-gray-950 dark:via-blue-950/20 dark:to-purple-950/20">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[500px] h-[500px] bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-float top-1/4 left-1/4" />
        <div className="absolute w-[600px] h-[600px] bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-float-delayed bottom-1/4 right-1/4" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Section */}
        <div className="text-center mb-20 mt-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full mb-6 border border-blue-500/20 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-pulse" />
            <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              About OptEx
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
            Financial Freedom
            <br />
            Made Simple
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We're on a mission to make personal finance management accessible, intelligent, and delightful for everyone.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <Card key={index} className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-card/50 backdrop-blur-xl border-2">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white mb-4 mx-auto group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            What We Stand For
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-card/50 backdrop-blur-xl border-2">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500" />
                <CardContent className="relative p-8">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${value.gradient} text-white mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                    {value.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-600 transition-colors">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features Highlight */}
        <Card className="mb-20 overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 border-0 shadow-2xl">
          <CardContent className="p-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-white mb-6">
                  Powerful Features at Your Fingertips
                </h2>
                <p className="text-white/90 text-lg mb-8">
                  Everything you need to manage your finances efficiently, all in one beautiful platform.
                </p>
                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 text-white">
                      <CheckCircle className="w-6 h-6 flex-shrink-0" />
                      <span className="text-lg">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 bg-white/10 rounded-3xl blur-3xl" />
                <div className="relative bg-white/20 backdrop-blur-xl rounded-3xl p-8 border border-white/30">
                  <div className="space-y-4">
                    <div className="h-4 bg-white/40 rounded-full w-3/4" />
                    <div className="h-4 bg-white/40 rounded-full w-full" />
                    <div className="h-4 bg-white/40 rounded-full w-5/6" />
                    <div className="space-y-2 mt-6">
                      <div className="flex gap-2">
                        <div className="h-20 bg-white/40 rounded-xl flex-1" />
                        <div className="h-20 bg-white/40 rounded-xl flex-1" />
                      </div>
                      <div className="h-32 bg-white/40 rounded-xl" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team/Creator Section */}
        <Card className="mb-12 overflow-hidden bg-card/50 backdrop-blur-xl border-2 shadow-xl">
          <CardContent className="p-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-500" />
                <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-2xl">
                 <Image src="/pic.jpg" alt="Aman Singh" layout="fill" className="rounded-full object-cover" />
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Aman Singh
                </h3>
                <p className="text-lg text-muted-foreground mb-4">
                  Founder & Lead Developer
                </p>
                <p className="text-muted-foreground leading-relaxed max-w-2xl">
                  A purpose-driven software developer passionate about creating innovative financial solutions 
                  that empower people to take control of their money. Built OptEx to make financial management 
                  simple, smart, and accessible to everyone.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="relative overflow-hidden bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10 backdrop-blur-xl border-2 border-blue-500/20">
            <CardContent className="p-12">
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Ready to Transform Your Finances?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of users who are already taking control of their financial future with OptEx.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/dashboard">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full px-8 py-6 shadow-xl hover:shadow-2xl transform transition-all duration-300 hover:scale-110 text-lg group">
                    <span className="flex items-center gap-2">
                      Get Started Free
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </Link>
                <Link href="#">
                  <Button size="lg" variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-full px-8 py-6 text-lg">
                    Try Demo
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Custom Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(5deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-40px) rotate(-5deg); }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 10s ease-in-out infinite;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
      `}} />
    </div>
  );
}

export default function AboutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <AboutPageContent />
    </Suspense>
  );
}
