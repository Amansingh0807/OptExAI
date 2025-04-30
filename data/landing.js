import {
    BarChart3,
    Receipt,
    PieChart,
    CreditCard,
    Globe,
    Zap,
  } from "lucide-react";
  
  // Stats Data
  export const statsData = [
    {
      value: "1K+",
      label: "Active Users",
    },
    {
      value: "$2M+",
      label: "Transactions Tracked",
    },
    {
      value: "1k+",
      label: "Happy Customers",
    },
    {
      value: "99.9%",
      label: "Uptime",
    },
    {
      value: "4.8/5",
      label: "User Rating",
    },
  ];
  
  // Features Data
  export const featuresData = [
    {
      icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
      title: "Enhanced Insights",
      description:
        "Gain in-depth understanding of your spending habits with AI-driven analytics",
    },
    {
      icon: <Receipt className="h-8 w-8 text-blue-600" />,
      title: "Intelligent Receipt Reader",
      description:
        "Automatically capture data from receipts with cutting-edge AI technology",
    },
    {
      icon: <PieChart className="h-8 w-8 text-blue-600" />,
      title: "Budget Planning",
      description: "Create and manage budgets with intelligent recommendations",
    },
    {
      icon: <CreditCard className="h-8 w-8 text-blue-600" />,
      title: "Unified Management for Multiple Accounts",
      description: "Effortlessly oversee all your accounts and credit cards in one platform",
    },
    {
      icon: <Globe className="h-8 w-8 text-blue-600" />,
      title: "Multi-Currency",
      description: "Support for multiple currencies with real-time conversion",
    },
    {
      icon: <Zap className="h-8 w-8 text-blue-600" />,
      title: "Intelligent Data-Driven Insights",
      description: "Receive smart financial insights and personalized recommendations",
    },
  ];
  
  // How It Works Data
  export const howItWorksData = [
    {
      icon: <CreditCard className="h-8 w-8 text-blue-600" />,
      title: "1. Create Your Account",
      description:
        "Get started in minutes with our simple and secure sign-up process",
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
      title: "2. Track Your Spending",
      description:
        "Automatically categorize and track your transactions in real-time",
    },
    {
      icon: <PieChart className="h-8 w-8 text-blue-600" />,
      title: "3. Get Insights",
      description:
        "Receive AI-powered insights and recommendations to optimize your finances",
    },
  ];
  
  // Testimonials Data
  export const testimonialsData = [
    {
      name: "telivio henski",
      role: "Small Business Owner",
      image: "/image1.jpg",
      quote:
      "OptEx has revolutionized the way I handle my business finances. The AI-driven insights have uncovered cost-saving opportunities I never realized were possible.",
    },
    {
      name: "Michael Chen",
      role: "Freelancer",
      image: "/image2.jpg",
      quote:
        "The receipt scanning feature saves me countless hours every month, allowing me to concentrate on my work instead of dealing with manual data entry and expense tracking.",
    },
    {
      name: "Himanshi Patel",
      role: "Financial Advisor",
      image: "/image3.jpg",
      quote:
        "I highly recommend OptEx to all my clients. Its multi-currency support and in-depth analytics make it ideal for international investors.",
    },
  ];