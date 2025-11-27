"use client";

import Link from "next/link";
import { ArrowRight, Coins, Lock, Brain, Leaf, Sparkle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Suspense, useEffect, useRef, useState } from "react";

function AboutPageContent() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Canvas particle effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5
      });
    }

    function animate() {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, i) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(16, 185, 129, 0.3)';
        ctx.fill();

        particles.forEach((particle2, j) => {
          if (i === j) return;
          const dx = particle.x - particle2.x;
          const dy = particle.y - particle2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(16, 185, 129, ${0.1 * (1 - distance / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(particle2.x, particle2.y);
            ctx.stroke();
          }
        });
      });
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const principles = [
    {
      icon: <Coins className="w-12 h-12" />,
      title: "Radical Transparency",
      description: "Every cent tracked. Every decision informed. We believe financial clarity is a human right, not a luxury.",
      color: "#10b981"
    },
    {
      icon: <Lock className="w-12 h-12" />,
      title: "Zero-Knowledge Design",
      description: "Your data lives encrypted, always. We built OptEx so even we can't see your transactions.",
      color: "#3b82f6"
    },
    {
      icon: <Brain className="w-12 h-12" />,
      title: "Intelligence Without Intrusion",
      description: "AI that learns your patterns without selling your secrets. Privacy and power, together.",
      color: "#8b5cf6"
    },
    {
      icon: <Leaf className="w-12 h-12" />,
      title: "Sustainable Growth",
      description: "Built for the long game. No dark patterns, no attention hijacking—just honest tools for honest people.",
      color: "#059669"
    }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Animated canvas background */}
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 pointer-events-none opacity-40 dark:opacity-30"
        style={{ zIndex: 0 }}
      />

      {/* Radial gradient that follows mouse */}
      <div 
        className="fixed inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(16, 185, 129, 0.08), transparent 40%)`,
          zIndex: 1
        }}
      />

      {/* Noise texture overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.015] dark:opacity-[0.03]"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
          zIndex: 2
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-24">
        
        {/* Hero Section */}
        <div className="mb-32 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-emerald-500/30 bg-emerald-500/5">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium tracking-wider text-emerald-300 uppercase">About OptEx</span>
          </div>

          <h1 className="text-7xl lg:text-8xl font-bold mb-8 leading-[0.9] tracking-tight">
            <span className="block text-foreground font-serif italic" style={{ fontFamily: '"Playfair Display", serif' }}>Money should</span>
            <span className="block text-emerald-500 dark:text-emerald-400 mt-2" style={{ fontFamily: 'monospace', letterSpacing: '-0.02em' }}>work_for_you</span>
          </h1>

          <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl leading-relaxed font-light">
            We're building financial tools that respect your intelligence, protect your privacy, and actually help you make better decisions. No gimmicks. No surveillance capitalism. Just honest technology.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
          {[
            { value: '100+', label: 'Trusted Users', detail: 'Managing their finances' },
            { value: '99.9%', label: 'Uptime SLA', detail: 'Always accessible' },
            { value: '<50ms', label: 'API Response', detail: 'Lightning fast' },
            { value: 'Zero', label: 'Data Sold', detail: 'Ever. Period.' }
          ].map((stat, i) => (
            <div 
              key={i} 
              className="group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-card/50 to-card/20 p-6 hover:border-emerald-500/50 transition-all duration-500"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/0 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="text-4xl font-bold text-foreground mb-2 font-mono">{stat.value}</div>
                <div className="text-sm font-semibold text-emerald-500 dark:text-emerald-400 mb-1 uppercase tracking-wider">{stat.label}</div>
                <div className="text-xs text-muted-foreground">{stat.detail}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Principles Section */}
        <div className="mb-32">
          <h2 className="text-5xl font-bold text-foreground mb-16 tracking-tight">
            <span className="text-muted-foreground">Our</span> Principles
          </h2>

          <div className="grid lg:grid-cols-2 gap-8">
            {principles.map((principle, i) => (
              <div 
                key={i}
                className="group relative overflow-hidden rounded-3xl border border-border bg-card/30 p-10 hover:border-border/80 transition-all duration-500"
                style={{ 
                  animationDelay: `${i * 150}ms`,
                }}
              >
                {/* Accent line */}
                <div 
                  className="absolute left-0 top-0 bottom-0 w-1 transition-all duration-500 group-hover:w-2"
                  style={{ backgroundColor: principle.color }}
                />
                
                <div className="relative">
                  <div 
                    className="mb-6 transition-transform duration-500 group-hover:scale-110"
                    style={{ color: principle.color }}
                  >
                    {principle.icon}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-foreground mb-4 tracking-tight">
                    {principle.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {principle.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-32">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card/50 to-card/20 p-12 lg:p-16">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
            
            <div className="relative grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="mb-6">
                  <div className="inline-flex items-center gap-3">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
                      <img 
                        src="/pic.jpg" 
                        alt="Aman Singh"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">Aman Singh</div>
                      <div className="text-sm text-muted-foreground font-mono">Founder / Lead Engineer</div>
                    </div>
                  </div>
                </div>
                
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Former systems architect turned financial tools builder. Started OptEx after watching too many people struggle with opaque banking apps and predatory financial products.
                </p>
                
                <p className="text-muted-foreground leading-relaxed">
                  Believes that good software should be invisible, powerful, and respectful of the people using it. Currently based in India, building for the world.
                </p>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl blur-xl" />
                <div className="relative rounded-2xl border border-border bg-card/80 p-8 backdrop-blur-sm">
                  <div className="flex items-start gap-4 mb-6">
                    <Sparkle className="w-6 h-6 text-emerald-500 dark:text-emerald-400 flex-shrink-0 mt-1" />
                    <div>
                      <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-2">Philosophy</div>
                      <div className="text-foreground/90 italic leading-relaxed">
                        "The best financial app is the one you barely notice, it just works, respects your privacy, and makes you smarter without making you anxious."
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-border pt-6">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Tech Stack</div>
                    <div className="flex flex-wrap gap-2">
                      {['Next.js', 'Prisma', 'PostgreSQL', 'Clerk', 'AI/ML'].map((tech) => (
                        <span key={tech} className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-mono">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-16 text-center">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgxNiwxODUsMTI5LDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
          
          <div className="relative">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 tracking-tight">
              Ready to take control?
            </h2>
            
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Join thousands who've made the switch to transparent, intelligent financial management.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/dashboard">
                <Button 
                  className="group relative overflow-hidden bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-6 text-lg rounded-full shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/30 border-0"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Start Using OptEx
                    <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
              </Link>
              
              <Link href="/transaction/create">
                <Button 
                  variant="outline"
                  className="px-8 py-6 text-lg rounded-full border-2 border-emerald-500/50 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500 transition-all duration-300"
                >
                  Try the Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* Global styles for fonts */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&display=swap');
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default function AboutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    }>
      <AboutPageContent />
    </Suspense>
  );
}
