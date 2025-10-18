"use client";

import Link from "next/link";
import { Github, Twitter, Linkedin, Mail, Heart, ArrowUpRight } from "lucide-react";

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
      { name: "About Us", href: "#" },
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
    { name: "GitHub", icon: Github, href: "https://github.com/Amansingh0807/OptExAI", color: "hover:text-purple-500" },
    { name: "Twitter", icon: Twitter, href: "https://x.com/Kuwardevv", color: "hover:text-blue-400" },
    { name: "LinkedIn", icon: Linkedin, href: "https://www.linkedin.com/in/amansingh08/", color: "hover:text-blue-600" },
    { name: "Email", icon: Mail, href: "mailto:amansingh0807@outlook.com", color: "hover:text-green-500" },
  ];

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-background to-primary/5 border-t border-border/50">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg">
                  <span className="text-2xl">💰</span>
                </div>
                <span className="text-2xl font-bold gradient-title">OptEx</span>
              </div>
              <p className="text-muted-foreground text-sm mb-6 max-w-sm">
                Your all-in-one financial management platform. Track expenses, manage budgets, and achieve your financial goals with ease.
              </p>
              
              {/* Social Links */}
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`h-10 w-10 rounded-xl bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-all duration-300 ${social.color}`}
                      aria-label={social.name}
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="text-lg">🚀</span>
                Product
              </h3>
              <ul className="space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-1 group"
                    >
                      {link.name}
                      <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="text-lg">🏢</span>
                Company
              </h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-1 group"
                    >
                      {link.name}
                      <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>


            {/* Legal Links */}
            <div>
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="text-lg">⚖️</span>
                Legal
              </h3>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-1 group"
                    >
                      {link.name}
                      <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* About Creator & Stats Section */}
        <div className="border-t border-border/50 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* About the Creator */}
            <div className="flex-1 max-w-md">
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <span className="text-lg">🧑‍💻</span>
                About the Creator
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Built by <span className="text-foreground font-medium">Aman Singh</span>, a Purpose Driven Software developer 
                creating innovative financial solutions to help people manage their finances better.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold gradient-title">10K+</div>
                <div className="text-xs text-muted-foreground">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold gradient-title">50K+</div>
                <div className="text-xs text-muted-foreground">Transactions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold gradient-title">99.9%</div>
                <div className="text-xs text-muted-foreground">Uptime</div>
              </div>
            </div>
          
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/50 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center sm:text-left">
              © {currentYear} OptEx. All rights reserved. Built with{" "}
              <Heart className="inline h-4 w-4 text-red-500 fill-current" /> by Aman Singh
            </p>
            
           
          </div>
        </div>
      </div>
    </footer>
  );
}
