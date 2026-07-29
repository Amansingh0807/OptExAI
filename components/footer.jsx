"use client";

import Link from "next/link";
import { Github, Twitter, Linkedin, Mail, ArrowUpRight } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: "Features", href: "#" },
      { name: "Dashboard", href: "/dashboard" },
      { name: "Transactions", href: "/transaction/create" },
      { name: "Pricing", href: "#" },
    ],
    company: [
      { name: "About Us", href: "/about" },
      { name: "Blog", href: "#" },
      { name: "Support", href: "#" },
      { name: "Contact", href: "#" },
    ],
    legal: [
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Cookie Policy", href: "#" },
      { name: "Security", href: "#" },
    ],
  };

  const socialLinks = [
    { name: "GitHub", icon: Github, href: "https://github.com/Amansingh0807/OptExAI" },
    { name: "Twitter", icon: Twitter, href: "https://x.com/Kuwardevv" },
    { name: "LinkedIn", icon: Linkedin, href: "https://www.linkedin.com/in/amansingh08/" },
    { name: "Email", icon: Mail, href: "mailto:amansingh0807@outlook.com" },
  ];

  return (
    <footer className="relative bg-background border-t border-border bg-dotted-grid font-mono overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 border-l border-r border-border mt-12">
          
          {/* Brand & Socials */}
          <div className="col-span-1 border-b md:border-b-0 md:border-r border-border p-8">
            <h3 className="font-playfair text-2xl font-black tracking-tighter mb-4">OPTEX.</h3>
            <p className="text-xs text-muted-foreground uppercase tracking-widest leading-relaxed mb-8">
              Bespoke financial management. Track, manage, and scale your goals with raw precision.
            </p>
            
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 w-10 border border-border flex items-center justify-center hover:bg-foreground hover:text-background snappy-transition"
                    aria-label={social.name}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links Grid */}
          {Object.entries(footerLinks).map(([category, links], index) => (
            <div key={category} className={`col-span-1 p-8 border-b md:border-b-0 ${index !== 2 ? 'md:border-r border-border' : ''}`}>
              <h3 className="text-xs font-bold uppercase tracking-widest text-foreground mb-6">
                {category}
              </h3>
              <ul className="space-y-4 nav-stagger">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary snappy-hover inline-flex items-center gap-1 group py-1"
                    >
                      {link.name}
                      <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Creator & Stats */}
        <div className="border-x border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 border-t border-border">
            <div className="p-8 border-b md:border-b-0 md:border-r border-border">
              <h3 className="text-xs font-bold uppercase tracking-widest text-foreground mb-2">
                Creator
              </h3>
              <p className="text-sm text-muted-foreground uppercase">
                Aman Singh / Developer
              </p>
            </div>
            
            <div className="p-8 flex gap-8 justify-around bg-foreground text-background">
              <div className="text-center">
                <div className="text-xl font-bold">10K+</div>
                <div className="text-[10px] uppercase tracking-widest opacity-70">Users</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold">50K+</div>
                <div className="text-[10px] uppercase tracking-widest opacity-70">Transacts</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold">99.9%</div>
                <div className="text-[10px] uppercase tracking-widest opacity-70">Uptime</div>
              </div>
            </div>
          </div>
        </div>

        {/* Massive Typographic Display */}
        <div className="border-x border-t border-border overflow-hidden bg-background py-8 flex justify-center items-center">
          <span className="font-playfair text-[15vw] leading-none font-black tracking-tighter text-foreground">
            OPTEX.
          </span>
        </div>

        {/* Bottom Bar */}
        <div className="border border-border py-4 px-8 mb-12 flex justify-between items-center text-[10px] uppercase tracking-widest text-muted-foreground bg-background">
          <p>© {currentYear} OPTEX. ALL RIGHTS RESERVED.</p>
          <p>BUILT WITH INTENT.</p>
        </div>

      </div>
    </footer>
  );
}
