"use client";

import React, { useEffect, useRef, useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, Sparkles, Shield, Zap, TrendingUp, Users, Clock, DollarSign, BarChart3, Lock, Brain, Leaf, CheckCircle } from "lucide-react";

const LandingPageContent = () => {
  const canvasRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 60;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
      });
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, i) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(16, 185, 129, 0.4)';
        ctx.fill();

        particles.forEach((otherParticle, j) => {
          if (i === j) return;
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(16, 185, 129, ${0.15 * (1 - distance / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const features = [
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Smart Analytics",
      description: "AI-powered insights that learn from your spending patterns and predict future trends.",
      color: "emerald"
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: "Bank-Level Security",
      description: "Military-grade encryption with zero-knowledge architecture. Your data, your control.",
      color: "teal"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Intelligent Automation",
      description: "Automatically categorize transactions, detect anomalies, and optimize your budget.",
      color: "cyan"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Real-Time Updates",
      description: "Lightning-fast synchronization across all your accounts and devices.",
      color: "emerald"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Growth Tracking",
      description: "Visualize your financial journey with beautiful charts and actionable recommendations.",
      color: "teal"
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      title: "Sustainable Finance",
      description: "Track and reduce your carbon footprint with spending insights tied to sustainability.",
      color: "cyan"
    }
  ];

  const stats = [
    { value: "100+", label: "Active Users" },
    { value: "99.9%", label: "Uptime" },
    { value: "$2M+", label: "Saved" },
    { value: "4.9", label: "User Rating" }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Entrepreneur",
      quote: "OptEx transformed how I manage my business finances. The AI insights are uncannily accurate.",
      initial: "SC"
    },
    {
      name: "Marcus",
      role: "Software Engineer",
      quote: "Finally, a financial app that respects my privacy and actually helps me save money.",
      initial: "MJ"
    },
    {
      name: "Priya Patel",
      role: "Designer",
      quote: "Beautiful interface, powerful features. OptEx makes finance management feel effortless.",
      initial: "PP"
    }
  ];

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Particle Canvas Background */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0 opacity-40 dark:opacity-30"
      />

      {/* Mouse-following gradient */}
      <div
        className="fixed pointer-events-none z-0 opacity-20 dark:opacity-10 transition-opacity duration-300"
        style={{
          width: '600px',
          height: '600px',
          left: mousePosition.x - 300,
          top: mousePosition.y - 300,
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Noise texture overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.015] dark:opacity-[0.03]">
        <svg width="100%" height="100%">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center mt-8 px-6 pt-20">
          <div className="max-w-6xl mx-auto text-center">
            <div 
              className="inline-block mb-6 px-4 py-2 rounded-full border border-border bg-card/30 backdrop-blur-sm"
              style={{ animation: 'fadeIn 0.6s ease-out' }}
            >
              <span className="text-sm font-mono text-emerald-500 dark:text-emerald-400">
                <Sparkles className="w-4 h-4 inline mr-2" />
                AI-Powered Financial Intelligence
              </span>
            </div>
            
            <h1 
              className="text-6xl md:text-8xl font-serif italic mb-6 text-foreground leading-tight"
              style={{ 
                fontFamily: "'Playfair Display', serif",
                animation: 'fadeIn 0.8s ease-out 0.2s backwards'
              }}
            >
              Optimize Your
              <br />
              <span className="text-emerald-500 dark:text-emerald-400">Financial Future</span>
            </h1>
            
            <p 
              className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed"
              style={{ animation: 'fadeIn 1s ease-out 0.4s backwards' }}
            >
              Track, analyze, and optimize your spending with AI-powered insights.
              <br />
              <span className="font-mono text-base">Zero compromises on privacy. Maximum control over your data.</span>
            </p>

            <div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              style={{ animation: 'fadeIn 1.2s ease-out 0.6s backwards' }}
            >
              <Link href="/dashboard">
                <Button 
                  size="lg" 
                  className="px-8 py-6 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full text-lg font-semibold shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105"
                >
                  Start Using OptEx
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/about">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="px-8 py-6 border-border hover:border-emerald-500 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105"
                >
                  Learn More
                </Button>
              </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 max-w-4xl mx-auto">
              {stats.map((stat, i) => (
                <div 
                  key={i}
                  className="text-center p-6 rounded-2xl border border-border bg-card/30 backdrop-blur-sm hover:border-emerald-500/50 transition-all duration-300"
                  style={{ animation: `fadeIn 0.6s ease-out ${0.8 + i * 0.1}s backwards` }}
                >
                  <div className="text-4xl font-bold text-emerald-500 dark:text-emerald-400 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground font-mono">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-32 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 
                className="text-5xl font-serif italic mb-4 text-foreground"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Built for the Future
              </h2>
              <p className="text-xl text-muted-foreground font-mono">
                Features that adapt to your financial reality
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, i) => (
                <div
                  key={i}
                  className="group p-8 rounded-2xl border border-border bg-card/30 backdrop-blur-sm hover:border-emerald-500/50 transition-all duration-300 hover:scale-105"
                  style={{ animation: `fadeIn 0.6s ease-out ${i * 0.1}s backwards` }}
                >
                  <div className={`text-${feature.color}-500 dark:text-${feature.color}-400 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-32 px-6 bg-card/20">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 
                className="text-5xl font-serif italic mb-4 text-foreground"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                How It Works
              </h2>
              <p className="text-xl text-muted-foreground font-mono">
                Three steps to financial clarity
              </p>
            </div>

            <div className="space-y-12">
              {[
                {
                  step: "01",
                  title: "Create Your Account",
                  description: "Sign up in seconds and start tracking your finances manually. Bank integrations coming soon with military-grade encryption.",
                  icon: <Shield className="w-12 h-12" />
                },
                {
                  step: "02",
                  title: "AI Analyzes Your Spending",
                  description: "Our machine learning models categorize transactions, detect patterns, and identify opportunities to save.",
                  icon: <Brain className="w-12 h-12" />
                },
                {
                  step: "03",
                  title: "Get Actionable Insights",
                  description: "Receive personalized recommendations, budget alerts, and spending forecasts that actually help you achieve your goals.",
                  icon: <Sparkles className="w-12 h-12" />
                }
              ].map((item, i) => (
                <div 
                  key={i}
                  className="flex flex-col md:flex-row items-start gap-6 p-8 rounded-2xl border border-border bg-card/30 backdrop-blur-sm hover:border-emerald-500/50 transition-all duration-300"
                  style={{ animation: `fadeIn 0.6s ease-out ${i * 0.2}s backwards` }}
                >
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 dark:text-emerald-400">
                      {item.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-mono text-emerald-500 dark:text-emerald-400 mb-2">
                      STEP {item.step}
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-32 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 
                className="text-5xl font-serif italic mb-4 text-foreground"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Trusted by Thousands
              </h2>
              <p className="text-xl text-muted-foreground font-mono">
                Real people, real results
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, i) => (
                <div
                  key={i}
                  className="p-8 rounded-2xl border border-border bg-card/30 backdrop-blur-sm hover:border-emerald-500/50 transition-all duration-300 hover:scale-105"
                  style={{ animation: `fadeIn 0.6s ease-out ${i * 0.1}s backwards` }}
                >
                  <div className="mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xl font-bold mb-4">
                      {testimonial.initial}
                    </div>
                    <div className="font-bold text-foreground mb-1">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-muted-foreground font-mono">
                      {testimonial.role}
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed italic">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-6 relative overflow-hidden">
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310b981' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-block mb-6 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30">
              <span className="text-sm font-mono text-emerald-500 dark:text-emerald-400">
                Join 10,000+ smart savers
              </span>
            </div>
            
            <h2 
              className="text-5xl md:text-6xl font-serif italic mb-6 text-foreground"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Ready to Take Control?
            </h2>
            
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Start optimizing your finances today. No credit card required.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/dashboard">
                <Button 
                  size="lg" 
                  className="px-10 py-6 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full text-lg font-semibold shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/about">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="px-10 py-6 border-border hover:border-emerald-500 text-emerald-600 dark:text-emerald-400 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105"
                >
                  Learn More
                </Button>
              </Link>
            </div>

            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>No credit card</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Bank-level security</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&display=swap');
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

const LandingPage = () => {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <LandingPageContent />
    </Suspense>
  );
};

export default LandingPage;

